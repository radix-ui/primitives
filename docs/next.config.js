const path = require('path');
const withTM = require('next-transpile-modules')(['@interop-ui']);

// https://github.com/hashicorp/next-mdx-enhanced
const withMdxEnhanced = require('next-mdx-enhanced')({
  layoutPath: 'layouts',
  defaultLayout: true,
  fileExtensions: ['mdx'],
  remarkPlugins: [require('remark-images'), require('@ngsctt/remark-smartypants')],
  rehypePlugins: [],
  extendFrontMatter: {},
  usesSrc: false,
});

module.exports = withMdxEnhanced(
  withTM({
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
  })
);
