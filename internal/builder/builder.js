// @ts-check
import path from 'node:path';
import fs from 'node:fs';
import * as esbuild from 'esbuild';
import * as tsup from 'tsup';

const DECLARATION_FILE_REGEX = /\.d\.(ts|mts)$/;
const REACT_MODULE_AUGMENTATION_START_REGEX = /declare module ['"]react['"]\s*\{/g;

/**
 * @param {string} relativePath
 */
export async function build(relativePath) {
  const packageJsonPath = path.resolve(relativePath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  const packageJsonContents = await fs.promises.readFile(packageJsonPath, 'utf-8').catch(() => {
    console.error(`Failed to read package.json file at ${packageJsonPath}`);
    process.exit(1);
  });

  /** @type {PackageJson} */
  let packageJson;
  try {
    packageJson = JSON.parse(packageJsonContents);
  } catch {
    console.error(`Failed to parse package.json file at ${packageJsonPath}`);
    process.exit(1);
  }

  const tasks = [];
  const pkg = packageJson.name;
  const sourceDirectory = path.resolve(relativePath || '.', 'src');

  // These packages emit every module in `src` as its own output file rather
  // than bundling everything into `index`. Long term we want to stop bundling
  // for all packages, but adding exceptions for now to more easily inspect the
  // output and catch breaking changes if they arise.
  const unbundledPackages = ['radix-ui', '@radix-ui/react-slot'];

  // Every package is built from one or more entry points (relative to `src`).
  // `index.ts` is always an entry point, and additional subpath entrypoints are
  // derived from the package's `exports` map so that each exported module is
  // emitted as its own set of files instead of being bundled into `index`.
  const files = new Set(['index.ts', ...getEntryFilesFromExports(packageJson.exports)]);

  if (unbundledPackages.includes(jhpkg)) {
    for (const file of getAllSourceEntryFiles(sourceDirectory)) {
      files.add(file);
    }
  } else if (pkg === '@radix-ui/primitive') {
    // The `is-development` subpath resolves to different files via
    // `development`/`production` export conditions, so build both variants even
    // though the top-level `exports` map only references one of them.
    files.add('internal/is-development.false.ts');
    files.add('internal/is-development.true.ts');
  }

  const entryPoints = [...files].map((file) => `${relativePath || '.'}/src/${file}`);
  const entryModulePaths = entryPoints.map((entryPoint) => path.resolve(entryPoint));
  const dist = `${relativePath || '.'}/dist`;

  /** @type {esbuild.BuildOptions} */
  const esbuildConfig = {
    entryPoints: entryPoints,
    external: ['@radix-ui/*'],
    packages: 'external',
    bundle: true,
    sourcemap: true,
    format: 'cjs',
    target: 'es2022',
    outdir: dist,
    keepNames: true,
    plugins: [preserveEntryImportsPlugin(entryModulePaths, '.js')],
  };

  tasks.push(esbuild.build(esbuildConfig).then(() => console.log(`CJS: Built ${relativePath}`)));
  tasks.push(
    esbuild
      .build({
        ...esbuildConfig,
        format: 'esm',
        outExtension: { '.js': '.mjs' },
        plugins: [preserveEntryImportsPlugin(entryModulePaths, '.mjs')],
      })
      .then(() => console.log(`ESM: Built ${relativePath}`)),
  );

  // tsup is used to emit d.ts files only (esbuild can't do that).
  //
  // Notes:
  // 1. Emitting d.ts files is super slow for whatever reason.
  // 2. It could have fully replaced esbuild (as it uses that internally),
  //    but at the moment its esbuild version is somewhat outdated.
  //    It’s also harder to configure and esbuild docs are more thorough.
  tasks.push(
    tsup
      .build({
        entry: entryPoints,
        format: ['cjs', 'esm'],
        dts: { only: true },
        outDir: dist,
        silent: true,
        external: [/@radix-ui\/.+/],
      })
      .then(() => console.log(`TSC: Built ${relativePath}`)),
  );

  await Promise.all(tasks);
  await stripLeakedReactModuleAugmentations(dist);
}

/**
 * @typedef {string | null | Record<string, unknown>} PackageExports
 * @typedef {{ name: string, exports?: PackageExports }} PackageJson
 */

/**
 * Collect entry files (relative to `src`) from a package's `exports` map so
 * that each exported source module is built as its own entry point rather than
 * being bundled into `index`.
 *
 * Only plain string subpath targets that point at a file inside `src` are
 * considered. Wildcard targets (eg. `./*`) and conditional export objects are
 * intentionally ignored. Those are handled by package-specific logic in
 * `build`.
 *
 * @param {PackageExports | undefined} exports
 * @returns {string[]}
 */
function getEntryFilesFromExports(exports) {
  if (!exports || typeof exports !== 'object') {
    return [];
  }

  const entryFiles = [];
  for (const target of Object.values(exports)) {
    if (typeof target !== 'string' || target.includes('*')) {
      continue;
    }

    const match = /^\.\/src\/(.+)$/.exec(target);
    const entryFile = match?.[1];
    if (entryFile) {
      entryFiles.push(entryFile);
    }
  }

  return entryFiles;
}

/**
 * List every buildable source module in `src` recursively, relative to `src`
 * and excluding `index.ts` itself. Used by packages that emit every module as
 * its own output file. `recursive` picks up nested modules.
 *
 * @param {string} sourceDirectory
 * @returns {string[]}
 */
function getAllSourceEntryFiles(sourceDirectory) {
  return fs
    .readdirSync(sourceDirectory, { recursive: true })
    .map((entry) => entry.toString().split(path.sep).join('/'))
    .filter((file) => isBuildableSourceFile(file) && file !== 'index.ts')
    .sort();
}

/**
 * Whether a file within `src` should be built as an entry point. Excludes type
 * declarations, tests, stories, and any non-TypeScript files (eg. snapshots).
 *
 * @param {string} file  Path relative to `src`, using `/` separators.
 * @returns {boolean}
 */
function isBuildableSourceFile(file) {
  return (
    /\.(ts|tsx)$/.test(file) && !file.endsWith('.d.ts') && !/\.(test|stories)\.(ts|tsx)$/.test(file)
  );
}

/**
 * esbuild plugin that keeps imports between a package's entry points as real
 * imports instead of inlining them. This prevents entry points from being
 * bundled into one another.
 *
 * Relative imports that resolve to another entry point are marked `external`
 * and rewritten to point at that entry point's emitted output file. The output
 * directory mirrors the `src` layout, so the relative specifier is preserved
 * and only the extension is adjusted (`.js` for CJS, `.mjs` for ESM).
 *
 * @param {string[]} entryModulePaths
 * @param {'.js' | '.mjs'} outExtension
 * @returns {esbuild.Plugin}
 */
function preserveEntryImportsPlugin(entryModulePaths, outExtension) {
  const entryModuleSet = new Set(
    entryModulePaths.map((entryModulePath) => path.normalize(entryModulePath)),
  );

  return {
    name: 'preserve-entry-imports',
    setup(build) {
      build.onResolve({ filter: /^\.\.?\// }, (args) => {
        if (args.kind === 'entry-point') {
          return null;
        }

        const resolved = resolveRelativeSourceModule(args.path, args.importer);
        if (!resolved || !entryModuleSet.has(path.normalize(resolved.absolutePath))) {
          return null;
        }

        return {
          path: buildEntryOutputSpecifier(args.path, resolved.isIndex, outExtension),
          external: true,
        };
      });
    },
  };
}

/**
 * Resolve a relative import specifier to the source module it points at,
 * mirroring the subset of Node/TypeScript resolution used in this codebase
 * (extensionless `.ts`/`.tsx` files and directory `index` files).
 *
 * @param {string} specifier
 * @param {string} importer
 * @returns {{ absolutePath: string, isIndex: boolean } | null}
 */
function resolveRelativeSourceModule(specifier, importer) {
  const base = path.resolve(path.dirname(importer), specifier);
  const candidates = [
    { absolutePath: `${base}.ts`, isIndex: false },
    { absolutePath: `${base}.tsx`, isIndex: false },
    { absolutePath: path.join(base, 'index.ts'), isIndex: true },
    { absolutePath: path.join(base, 'index.tsx'), isIndex: true },
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate.absolutePath)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Rewrite a relative import specifier so it points at an entry point's emitted
 * output file, preserving the specifier and adjusting only the extension.
 *
 * @param {string} specifier
 * @param {boolean} isIndex
 * @param {'.js' | '.mjs'} outExtension
 * @returns {string}
 */
function buildEntryOutputSpecifier(specifier, isIndex, outExtension) {
  const specifierWithoutExtension = specifier.replace(/\.(ts|tsx)$/, '');
  return isIndex
    ? `${specifierWithoutExtension}/index${outExtension}`
    : `${specifierWithoutExtension}${outExtension}`;
}

/**
 * Prevent global React module augmentations from leaking to consumers through published types.
 * @param {string} distDirectoryPath
 */
async function stripLeakedReactModuleAugmentations(distDirectoryPath) {
  const distEntries = await fs.promises
    .readdir(distDirectoryPath, { recursive: true })
    .catch(() => []);
  const declarationFilePaths = distEntries
    .map((entry) => entry.toString())
    .filter((fileName) => DECLARATION_FILE_REGEX.test(fileName))
    .map((fileName) => path.resolve(distDirectoryPath, fileName));

  await Promise.all(
    declarationFilePaths.map((declarationFilePath) =>
      stripReactModuleAugmentationsFromDeclarationFile(declarationFilePath),
    ),
  );
}

/**
 * @param {string} declarationFilePath
 */
async function stripReactModuleAugmentationsFromDeclarationFile(declarationFilePath) {
  const declarationContents = await fs.promises.readFile(declarationFilePath, 'utf-8');
  const declarationContentsWithoutAugmentations =
    removeReactModuleAugmentations(declarationContents);

  if (declarationContents === declarationContentsWithoutAugmentations) {
    return;
  }

  await fs.promises.writeFile(
    declarationFilePath,
    declarationContentsWithoutAugmentations,
    'utf-8',
  );
}

/**
 * @param {string} declarationContents
 */
function removeReactModuleAugmentations(declarationContents) {
  REACT_MODULE_AUGMENTATION_START_REGEX.lastIndex = 0;

  let strippedDeclarationContents = '';
  let contentCursor = 0;
  let reactModuleAugmentationMatch;

  while (
    (reactModuleAugmentationMatch =
      REACT_MODULE_AUGMENTATION_START_REGEX.exec(declarationContents)) !== null
  ) {
    const augmentationStartIndex = reactModuleAugmentationMatch.index;
    const openingBraceIndex = REACT_MODULE_AUGMENTATION_START_REGEX.lastIndex - 1;
    const augmentationEndIndex = getMatchingClosingBraceIndex(
      declarationContents,
      openingBraceIndex,
    );

    if (augmentationEndIndex === -1) {
      throw new Error(
        `Could not find end of React module augmentation near index ${augmentationStartIndex}.`,
      );
    }

    strippedDeclarationContents += declarationContents.slice(contentCursor, augmentationStartIndex);
    contentCursor = augmentationEndIndex + 1;

    while (
      contentCursor < declarationContents.length &&
      /\s/.test(declarationContents.charAt(contentCursor))
    ) {
      contentCursor += 1;
    }

    if (declarationContents.charAt(contentCursor) === ';') {
      contentCursor += 1;
    }

    while (
      contentCursor < declarationContents.length &&
      (declarationContents.charAt(contentCursor) === '\n' ||
        declarationContents.charAt(contentCursor) === '\r')
    ) {
      contentCursor += 1;
    }

    REACT_MODULE_AUGMENTATION_START_REGEX.lastIndex = contentCursor;
  }

  if (contentCursor === 0) {
    return declarationContents;
  }

  strippedDeclarationContents += declarationContents.slice(contentCursor);
  return strippedDeclarationContents;
}

/**
 * @param {string} content
 * @param {number} openingBraceIndex
 */
function getMatchingClosingBraceIndex(content, openingBraceIndex) {
  let braceDepth = 1;
  let index = openingBraceIndex + 1;

  while (index < content.length) {
    const currentCharacter = content[index];
    const nextCharacter = content[index + 1];

    if (currentCharacter === "'" || currentCharacter === '"' || currentCharacter === '`') {
      index = skipStringLiteral(content, index, currentCharacter);
      continue;
    }

    if (currentCharacter === '/' && nextCharacter === '/') {
      index = skipLineComment(content, index);
      continue;
    }

    if (currentCharacter === '/' && nextCharacter === '*') {
      index = skipBlockComment(content, index);
      continue;
    }

    if (currentCharacter === '{') {
      braceDepth += 1;
    } else if (currentCharacter === '}') {
      braceDepth -= 1;

      if (braceDepth === 0) {
        return index;
      }
    }

    index += 1;
  }

  return -1;
}

/**
 * @param {string} content
 * @param {number} startIndex
 * @param {"'" | '"' | "`"} quoteCharacter
 */
function skipStringLiteral(content, startIndex, quoteCharacter) {
  let index = startIndex + 1;

  while (index < content.length) {
    const currentCharacter = content[index];

    if (currentCharacter === '\\') {
      index += 2;
      continue;
    }

    if (currentCharacter === quoteCharacter) {
      return index + 1;
    }

    index += 1;
  }

  return index;
}

/**
 * @param {string} content
 * @param {number} startIndex
 */
function skipLineComment(content, startIndex) {
  let index = startIndex + 2;

  while (index < content.length && content[index] !== '\n') {
    index += 1;
  }

  return index;
}

/**
 * @param {string} content
 * @param {number} startIndex
 */
function skipBlockComment(content, startIndex) {
  let index = startIndex + 2;

  while (index < content.length - 1) {
    if (content[index] === '*' && content[index + 1] === '/') {
      return index + 2;
    }

    index += 1;
  }

  return content.length;
}
