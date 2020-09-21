#!/usr/bin/env node
const Service = require('@vue/cli-service');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const { getFileSystemConfig } = require('../src/helpers/config/node');
const { Logger } = require('../src/helpers/logger');

const logger = new Logger('cli');

const madocConfig = getFileSystemConfig(process.cwd());
process.env.MADOC_PATH = process.cwd();

const madocPath = path.resolve(__dirname, '../');

const serviceArgs = {
  modern: false,
  report: false,
  'report-json': false,
  'inline-vue': false,
  watch: false,
  open: false,
  copy: false,
  https: false,
  verbose: false
};

// TODO init command

switch (argv._[0]) {
  case 'dev': {
    const port = 5000;
    const yargs = {
      _: [ 'serve' ],
      ...serviceArgs,
      port
    };
    const args = ['serve', '--port', port.toString()];
    const service = new Service(madocPath);
    service.run('serve', yargs, args)
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
    break;
  }
  case 'build': {
    const distPath = path.resolve(process.cwd(), madocConfig.distPath);
    const yargs = {
      _: [ 'build' ],
      ...serviceArgs,
      dest: distPath
    };
    const args = ['build', '--dest', distPath];
    const service = new Service(madocPath);
    service.run('build', yargs, args)
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
    break;
  }
  case 'serve': {
    const port = 5001;
    const { serve } = require('../src/helpers/cli/serve');
    serve(port, madocConfig);
    break;
  }
}
