const { Optimizer } = require('@parcel/plugin');
const SourceMap = require('@parcel/source-map').default;
const { blobToString } = require('@parcel/utils');

// https://github.com/parcel-bundler/parcel/issues/9050#issuecomment-1565667210
module.exports = new Optimizer({
  async optimize({ contents, map, options }) {
    const strContents = await blobToString(contents);
    let sourceMap;

    if (map != null) {
      sourceMap = new SourceMap(options.projectRoot);
      sourceMap.addSourceMap(map, 1); // Offset lines by 1
    }

    const nextContents = /use client/g.test(strContents)
      ? '"use client";\n' + strContents.replace('"use client";', '')
      : strContents;

    return { contents: nextContents, map: sourceMap };
  },
});
