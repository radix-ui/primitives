import path from 'path';
import { resolvePackage } from './utils';

const projectRoot = path.resolve(__dirname, '../');

export const paths = {
  projectRoot,
  packages: path.join(projectRoot, 'packages'),
  packageRoot: resolvePackage('.'),
  packageDist: resolvePackage('dist'),
  packageDistTypes: resolvePackage('dist/types'),
  projectCache: path.join(projectRoot, '.cache'),
  progressEstimatorCache: path.join(projectRoot, 'node_modules/.cache/.progress-estimator'),
};
