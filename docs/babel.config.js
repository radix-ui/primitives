const glob = require('glob');
const isGlob = require('is-glob');
const path = require('path');

module.exports = {
  presets: ['next/babel'],
  plugins: [
    importGlobArrayPlugin,
    ['styled-components', { ssr: true, displayName: true, preprocess: false }],
  ],
};

// https://github.com/jescalan/babel-plugin-import-glob-array
function importGlobArrayPlugin(babel) {
  const { types: t } = babel;
  return {
    visitor: {
      ImportDeclaration(_path, state) {
        const importPath = _path.node.source.value;
        const currentFilePath = state.file.opts.filename;
        const baseDir = path.resolve(path.dirname(currentFilePath));

        // If this is not a local require, don't do anything
        if (importPath[0] !== '.' && importPath[0] !== '/') return;

        // If the import specifier doesn't contain a glob pattern, don't do
        // anything
        if (!isGlob(importPath)) return;

        // if no filename was provided, we can't get directory contents
        if (!currentFilePath || currentFilePath === 'unknown') {
          throw new Error(
            'You must provide a filename to babel in order to be able to use the directory import plugin'
          );
        }

        // run the glob to determine which files we need to import
        const files = glob.sync(path.join(baseDir, importPath), state.opts.globOptions);

        // format them so they are relative to the current file
        const filesRelative = files.map((file) => path.resolve(currentFilePath, file));

        // First we go through the right side of the import and expand the
        // single wildcard to multiple individual imports. In the process, we
        // assign a placeholder variable name to each import. Later, we will put
        // the placeholders in an array and assign that to the actual name.
        const namePlaceholderMap = {};
        const importMetaMap = {};
        const importStatements = filesRelative.map((filePath) => {
          // Now let's go through the left side of the import statement, known
          // as "specifiers" to babel. In this section we will see one or more
          // import specifiers. For example, we might see something like "import
          // x", which would be a single specifier, or "import x, { y as z }",
          // which would be an array of two specifiers.
          const specifiers = _path.node.specifiers.reduce((acc, specifier) => {
            // First we check whether we have a special _importMeta import,
            // which gets handled differently. For this special export, we
            // actually want to remove it, then add a variable below that
            // contains the meta values directly. So for example:
            //
            // import pages, {_importMeta as metadata } from './pages/*'
            //
            // would turn into:
            //
            // import _iga1 from './pages/foo'
            // import _iga2 from './pages/bar'
            // const pages = [_iga1, iga2]
            // const metadata = [{ path: 'pages/foo.js' }, { path: 'pages/bar.js' }]
            if (specifier.imported && specifier.imported.name === '_importMeta') {
              // First we create a key for the variable that we're trying to
              // import metadata into, if there isn't one already
              const name = specifier.local.name;
              if (!importMetaMap[name]) importMetaMap[name] = [];

              // Then we add the file paths to the metadata, formatted as babel
              // expressions since we plan to add it to the source later.
              importMetaMap[name].push(
                t.objectExpression([
                  t.objectProperty(
                    t.identifier('absolutePath'),
                    t.stringLiteral(path.resolve(baseDir, filePath))
                  ),
                  t.objectProperty(
                    t.identifier('importedPath'),
                    t.stringLiteral(filePath.replace(baseDir, ''))
                  ),
                ])
              );

              // and we return the accumulator without adding to it, since
              // _importMeta is a synthetic import that we process separately
              return acc;
            }

            // Next we'll set up a placeholder for the import. Later on we will
            // rename it to the intended name, for now we need to prevent
            // conflicts.
            const placeholder = _path.scope.generateUid('_iga');

            // Import specifiers can have two names, a local and imported name.
            // The local name represents what the import is actually named
            // within your javacript file. So for example, with "import x", the
            // local name is "x". With "import { x as y }" the local name is
            // "y". In this example, "x" is referred to as the imported name.
            const name = specifier.local.name;

            // Now we need to associate the local name "x" with the placeholder
            // we're about to replace it with, so that later we can create
            // x = [_iga1, _iga2, ...etc]
            if (!namePlaceholderMap[name]) namePlaceholderMap[name] = [];
            namePlaceholderMap[name].push(t.identifier(placeholder));

            // There are three types of import specifiers we could be dealing
            // with here. Depending on which type, we need to slightly modify
            // the output.
            if (t.isImportDefaultSpecifier(specifier)) {
              // An "import default specifier" could be for example: "import x"
              // This needs to be transformed into "import _iga1"
              acc.push(t.importDefaultSpecifier(t.identifier(placeholder)));
              return acc;
            } else if (t.isImportSpecifier(specifier)) {
              // Next, an "import specifier" could be for example:
              // "import { x as y }"
              // This needs to be transformed into "import { x as _iga1 }"
              acc.push(
                t.importSpecifier(t.identifier(placeholder), t.identifier(specifier.imported.name))
              );
              return acc;
            } else if (t.isImportNamespaceSpecifier(specifier)) {
              // An "import namespace specifier" could be for example:
              // "import * as x"
              // This needs to be transformed into "import * as _iga1"
              acc.push(t.importNamespaceSpecifier(t.identifier(placeholder)));
              return acc;
            }
            // At the time of writing, these three are the only import
            // specifiers that can be used. If something else is here, it's
            // either a huge bug, or a new addition to es6 imports
            throw new Error(`Unrecognized import specifier: ${specifier.type}`);
          }, []);

          // With all of that out of the way, let's format our new import
          // statement. On the left, we have our new specifiers modified with
          // placeholders, and on the right, our glob-resolved path, like
          // import _iga1, {metadata as _iga2} from './some/file1'
          return t.importDeclaration(specifiers, t.stringLiteral(filePath));
        });

        // Final step! Now we need to re-associate the original variable names
        // with all the placeholders. Luckily, we have been keeping track of
        // this, so we can use the namePlaceholderMap to quickly write out new
        // variable statements that look something like this:
        // const x = [_iga1, _iga2]
        const varRemappings = [];
        for (let k in namePlaceholderMap) {
          varRemappings.push(
            t.variableDeclaration('const', [
              t.variableDeclarator(t.identifier(k), t.arrayExpression(namePlaceholderMap[k])),
            ])
          );
        }

        // And then we do the same for any of the special-treatment
        // _importMeta statements
        const importMetaRemappings = [];
        for (let k in importMetaMap) {
          importMetaRemappings.push(
            t.variableDeclaration('const', [
              t.variableDeclarator(t.identifier(k), t.arrayExpression(importMetaMap[k])),
            ])
          );
        }

        // and now we replace the original code with our new code!
        _path.replaceWithMultiple([...importStatements, ...varRemappings, ...importMetaRemappings]);
      },
    },
  };
}
