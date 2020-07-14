import fs from 'fs-extra';
import { paths } from './constants';

async function clean() {
  await fs.remove(paths.packageDist);
}

clean();
