import path from 'path';

const projectRoot = path.resolve(__dirname, '../');

export const paths = {
  projectRoot,
  packages: path.join(projectRoot, 'packages'),
  projectCache: path.join(projectRoot, '.cache'),
};
