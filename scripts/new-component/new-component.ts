import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import program from 'commander';
import defaultConfig from './config';
import { pascalCase } from 'pascal-case';
import { kebabCase } from 'lodash';
import shell from 'shelljs';

// Load our package.json, so that we can pass the version onto `commander`.
import pkgJson from '../../package.json';

// TODO: When we start using the primitives model, we need to create a primitive
// component that corresponds with the framework component if one doesn't
// already exist.

function createComponent() {
  const { version = '1.0.0' } = pkgJson;
  const config = getConfig();
  const prettify = buildPrettifier(getPrettierConfig());

  program
    .version(version)
    .arguments('<componentName>')
    .option(
      '-f, --framework <framework>',
      `Component framework for the component (default: "${defaultConfig.framework}")`,
      /^(react)$/i,
      config.framework
    )
    // TODO: This option will depend on the framework selected eventually
    .option(
      '-t, --type <componentType>',
      `Type of React component to generate (default: "${defaultConfig.type}")`,
      /^(class|class-pure|functional|functional-memo|forward-ref|forward-ref-memo)$/i,
      config.type
    )
    .option(
      '-d, --dir <pathToDirectory>',
      `Path to the component's package directory (default: "${defaultConfig.dir}")`,
      config.dir
    )
    .parse(process.argv);

  const [componentNameEntry] = program.args;

  const componentName = pascalCase(componentNameEntry);
  const componentNameLower = kebabCase(componentName);
  const packageName = kebabCase(`${program.framework}-${componentNameLower}`);

  // When we use other frameworks, we may not need tsx. Unsure!
  const isTsx = true;
  const extension = isTsx ? 'tsx' : 'ts';

  // Find the path to the selected template file
  const templatePath = `./templates/${program.framework}/${program.type}.${extension}`;
  const packageJsonTemplatePath = `./templates/package.json`;

  const srcDir = 'src';

  // Get all of our file paths worked out
  const packageDir = path.join(program.dir, program.framework, componentNameLower);
  const componentDir = path.join(packageDir, srcDir);
  const filePath = path.join(componentDir, `${componentName}.${extension}`);
  const indexPath = path.join(componentDir, 'index.ts');
  const packageJsonPath = path.join(packageDir, 'package.json');

  // Our index template is super straightforward, so we'll just inline it for now.
  const indexTemplate = prettify(`\
export { ${componentName} } from './${componentName}';
`);

  logIntro({
    name: componentName,
    dir: componentDir,
    type: program.type,
  });

  // Check if componentName is provided
  if (!componentName) {
    logError(
      `Sorry, you need to specify a name for your component like this: new-component <name>`
    );
    process.exit(0);
  }

  // Check to see if a directory at the given path exists
  const fullPathToParentDir = path.resolve(program.dir);
  if (!fs.existsSync(fullPathToParentDir)) {
    logError(
      `Sorry, you need to create a parent directory for the component. 🎺\nNo directory found at ${program.dir}.`
    );
    process.exit(0);
  }

  // Check to see if this component has already been created
  const fullPathToComponentDir = path.resolve(componentDir);
  if (fs.existsSync(fullPathToComponentDir)) {
    logError(
      `Looks like this component already exists! 🎺\nThere's already a component at ${componentDir}.`
    );
    process.exit(0);
  }

  // Start by creating the directory that our component lives in.
  mkDirPromise(componentDir)
    .then(() => readFilePromiseRelative(packageJsonTemplatePath))
    .then((packageJsonTemplate) => {
      logItemCompletion('Package directories created.');
      return packageJsonTemplate;
    })
    .then((packageJsonTemplate) => {
      // Replace our placeholders with real data (so far, just the component name)
      return packageJsonTemplate
        .replace(/COMPONENT_NAME/g, componentName)
        .replace(/PACKAGE_NAME/g, packageName)
        .replace(/CURRENT_VERSION/g, version);
    })
    .then((packageJsonTemplate) => {
      // Format it using prettier, to ensure style consistency, and write to file.
      return writeFilePromise(packageJsonPath, packageJsonTemplate);
    })
    .then(() => {
      logItemCompletion('package.json created.');
      return readFilePromiseRelative(templatePath);
    })
    .then((template) => {
      logItemCompletion('Directory created.');
      return template;
    })
    .then((template) => {
      // Replace our placeholders with real data (so far, just the component name)
      return template
        .replace(/COMPONENT_NAME/g, componentName)
        .replace(/PACKAGE_NAME/g, packageName)
        .replace(/CURRENT_VERSION/g, version);
    })
    .then((template) => {
      // Format it using prettier, to ensure style consistency, and write to file.
      return writeFilePromise(filePath, prettify(template));
    })
    .then((template) => {
      logItemCompletion('Component built and saved to disk.');
      return template;
    })
    .then(() => {
      return writeFilePromise(indexPath, prettify(indexTemplate));
    })
    .then((template) => {
      logItemCompletion('Index file built and saved to disk.');
      return template;
    })
    .then((template) => {
      logConclusion();
    })
    .catch((err) => {
      console.error(err);
    });
}

function mkDirPromise(dirPath: string) {
  return new Promise((resolve, reject) => {
    try {
      const res = shell.mkdir('-p', dirPath);
      if (shell.error()) {
        reject(res.stderr);
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

// Simple promise wrappers for read/write files.
// utf-8 is assumed.
export function readFilePromise(fileLocation: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileLocation, 'utf-8', (err, text) => {
      err ? reject(err) : resolve(text);
    });
  });
}

function writeFilePromise(fileLocation: string, fileContent: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileLocation, fileContent, 'utf-8', (err) => {
      err ? reject(err) : resolve();
    });
  });
}

// Somewhat counter-intuitively, `fs.readFile` works relative to the current
// working directory (if the user is in their own project, it's relative to
// their project). This is unlike `require()` calls, which are always relative
// to the code's directory.
function readFilePromiseRelative(fileLocation: string) {
  return module.exports.readFilePromise(path.join(__dirname, fileLocation));
}

// Get the configuration for this component.
// Overrides are as follows:
//  - default values
//  - globally-set overrides
//  - project-specific overrides
//  - command-line arguments.
//
// The CLI args aren't processed here; this config is used when no CLI argument
// is provided.
function getConfig() {
  // const home = os.homedir();
  // const currentPath = process.cwd();

  return {
    ...defaultConfig,
  };
}

function getPrettierConfig(prettierConfig?: prettier.Options | undefined) {
  if (prettierConfig) {
    return {
      ...prettierConfig,
      parser: 'typescript',
    } as prettier.Options;
  }
  let cfg = prettier.resolveConfig.sync(process.cwd());
  let opts = cfg || {};

  return {
    ...opts,
    parser: 'typescript',
  } as prettier.Options;
}

function buildPrettifier(prettierConfig?: prettier.Options | undefined) {
  return (text: string) => prettier.format(text, prettierConfig);
}

// Emit a message confirming the creation of the component
const colors = {
  red: [216, 16, 16],
  green: [142, 215, 0],
  blue: [0, 186, 255],
  gold: [255, 204, 0],
  mediumGray: [128, 128, 128],
  darkGray: [90, 90, 90],
} as const;

function logComponentType(selected: any) {
  return ['class', 'class-pure', 'functional', 'functional-memo', 'forward-ref', 'forward-ref-memo']
    .sort((a, b) => (a === selected ? -1 : 1))
    .map((option) =>
      option === selected
        ? `${chalk.bold.rgb(...colors.blue)(option)}`
        : `${chalk.rgb(...colors.darkGray)(option)}`
    )
    .join('  ');
}

function logIntro({ name, dir, type }: any) {
  console.info('\n');
  console.info(`✨  Creating the ${chalk.bold.rgb(...colors.gold)(name)} component ✨`);
  console.info('\n');

  const pathString = chalk.bold.rgb(...colors.blue)(dir);
  const typeString = logComponentType(type);

  console.info(`Directory:  ${pathString}`);
  console.info(`Type:       ${typeString}`);
  console.info(chalk.rgb(...colors.darkGray)('========================================='));

  console.info('\n');
}

function logItemCompletion(successText: string) {
  const checkmark = chalk.rgb(...colors.green)('✓');
  console.info(`${checkmark} ${successText}`);
}

function logConclusion() {
  console.info('\n');
  console.info(chalk.bold.rgb(...colors.green)('Component created! 🚀🚀🚀'));
  console.info('\n');
}

function logError(error: any) {
  console.info('\n');
  console.info(chalk.bold.rgb(...colors.red)('Error creating component.'));
  console.info(chalk.rgb(...colors.red)(error));
  console.info('\n');
}

export default createComponent;
