import type {PlopTypes} from '@turbo/gen';
import {execSync} from 'node:child_process';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('init:package', {
    description: 'Initialize a new package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the package?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/{{name}}/package.json',
        templateFile: 'templates/package.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/tsconfig.json',
        templateFile: 'templates/tsconfig.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/eslint.config.js',
        templateFile: 'templates/eslint.config.js.hbs',
      },
      async (answers) => {
        const {name} = answers as {name: string};

        execSync(`mkdir -p packages/${name}/src`);
        execSync(`touch packages/${name}/src/index.ts`);
        execSync('pnpm i', {stdio: 'inherit'});

        return 'Package initialized successfully ✅';
      },
    ],
  });
}
