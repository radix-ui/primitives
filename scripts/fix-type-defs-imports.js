const fsExtra = require('fs-extra');
const path = require('path');
const glob = require('glob');
const replaceInFiles = require('replace-in-files');

console.log('Fix bad imports in d.ts files…');

async function runFix() {
  try {
    const { countOfMatchesByPaths } = await replaceInFiles({
      files: 'packages/**/dist/**/*.d.ts',
      from: /(import\("@radix-ui\/[a-z-]+)[a-zA-Z/"]*"\)/g,
      to: '$1")',
    });
    console.log('Fixed:', countOfMatchesByPaths);
  } catch (error) {
    console.error('Error fixing bad imports in d.ts files:', error);
  }

  const distPath = path.join(__dirname, '../packages/**/dist/**/*.d.ts').replace(/\\/g, '/');
  const allFiles = glob.sync(distPath);
  for (const file of allFiles) {
    const dest = file.replace('d.ts', 'd.mts');
    fsExtra.copySync(file, dest);
  }
}

runFix();
