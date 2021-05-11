const replaceInFiles = require('replace-in-files');

console.log('Fix bad imports in d.ts files…');

replaceInFiles({
  files: 'packages/**/dist/**/*.d.ts',
  from: /(import\("@radix-ui\/[a-z-]+)[a-zA-Z/"]*"\)/g,
  to: '$1")',
})
  .then(({ countOfMatchesByPaths }) => console.log('Fixed:', countOfMatchesByPaths))
  .catch((error) => console.error('Error fixing bad imports in d.ts files:', error));
