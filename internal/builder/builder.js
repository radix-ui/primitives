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
  const files = ['index.ts'];
  if (pkg === 'radix-ui') {
    files.push('internal.ts');
  }

  const entryPoints = files.map((file) => `${relativePath || '.'}/src/${file}`);
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
  };

  tasks.push(esbuild.build(esbuildConfig).then(() => console.log(`CJS: Built ${relativePath}`)));
  tasks.push(
    esbuild
      .build({
        ...esbuildConfig,
        format: 'esm',
        outExtension: { '.js': '.mjs' },
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
 * @typedef {{ name: string }} PackageJson
 */

/**
 * Prevent global React module augmentations from leaking to consumers through published types.
 * @param {string} distDirectoryPath
 */
async function stripLeakedReactModuleAugmentations(distDirectoryPath) {
  const distFileNames = await fs.promises.readdir(distDirectoryPath).catch(() => []);
  const declarationFilePaths = distFileNames
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
