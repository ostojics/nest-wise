// This file sets up tsconfig-paths and then runs the TypeScript global teardown
require('tsconfig-paths').register({
  baseUrl: __dirname + '/../../..',
  paths: {
    'src/*': ['src/*'],
  },
});

require('ts-node').register({
  project: __dirname + '/../tsconfig.json',
});

module.exports = require('./global-teardown.ts').default;
