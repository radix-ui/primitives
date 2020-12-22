module.exports = {
  babelVersion: 7,
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 0.25%'],
          node: '8',
        },
        useBuiltIns: 'entry',
        corejs: 2,
        shippedProposals: true,
        modules: false,
      },
    ],
  ],
};
