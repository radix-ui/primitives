const template = require('@babel/template');

const buildAssign = template.smart('Object.assign(COMPONENT, { displayName: DISPLAY_NAME });');

const pureDisplayNames = () => ({
  visitor: {
    AssignmentExpression(path) {
      if (
        path.node.left.type === 'MemberExpression' &&
        path.node.left.property.name === 'displayName' &&
        path.node.right.name
      ) {
        const COMPONENT = path.node.left.object.name;
        const DISPLAY_NAME = path.node.right.name;
        const ast = buildAssign({ COMPONENT, DISPLAY_NAME });
        path.replaceWith(ast);
        path.addComment('leading', '#__PURE__');
      }
    },
  },
});

module.exports = {
  presets: [
    [
      '@parcel/babel-preset-env',
      {
        bugfixes: true,
        targets: {
          browsers: 'Chrome >= 74, Safari >= 13.1, iOS >= 13.3, Firefox >= 78, Edge >= 79',
          node: 12,
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    pureDisplayNames,
    '@parcel/babel-plugin-transform-runtime',
    ['@babel/plugin-transform-typescript', { isTSX: true }],
  ],
};
