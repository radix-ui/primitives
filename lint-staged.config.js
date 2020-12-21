const lint = 'yarn lint --quiet --fix --cache';

// https://github.com/okonet/lint-staged/issues/825#issuecomment-620018284
module.exports = {
  '*.{js}': [lint],
  '*.{ts,tsx}': [lint, () => 'tsc --skipLibCheck --noEmit'],
};
