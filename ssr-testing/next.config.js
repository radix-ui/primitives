const path = require('path');
const withTM = require('next-transpile-modules')([]);

module.exports = withTM({
  webpack(config) {
    // https://github.com/josephluck/next-typescript-monorepo/blob/master/blog/next.config.js
    const babelRule = config.module.rules.find((rule) =>
      rule.use && Array.isArray(rule.use)
        ? rule.use.find((u) => u.loader === 'next-babel-loader')
        : rule.use.loader === 'next-babel-loader'
    );

    if (babelRule) {
      babelRule.include.push(path.resolve('../'));
    }

    return config;
  },
});
