#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const c = require('ansi-colors');
const inquirer = require('inquirer');
const argv = require('yargs').argv;
const { spawn } = require('child_process');
const pkg = require('../package.json');

// Helpers
const { build } = require('./build');
const { dev } = require('./dev');
const { serve } = require('./serve');

const notes = [
  '',
  `${c.green(`Madoc v${pkg.version} in use.`)}`,
  '',
  'Usage:',
  `  madoc ${c.cyan('[cmd]')} ${c.yellow('{args}')}`,
  '',
  `${c.cyan('Commands')}:`,
  `  ${c.cyan('dev')}: Runs the documentation in developement mode.`,
  `  ${c.cyan('build')}: Builds the documentation as static website for production.`,
  '',
  `${c.yellow('Arguments')}:`,
  `  ${c.yellow('--help')}: Shows the help for a ${c.cyan('command')}.`
];

const rootPath = process.env.MADOC_PATH || process.cwd();
const madocComponentsPath = path.resolve(rootPath, './.madoc/components.js');
let madocConfig = {};
let madocConfigPath = path.resolve(process.cwd(), 'madoc.config.js');
let madocCustomComponentsPath = '';
let customComponents;
if (fs.existsSync(madocComponentsPath)) {
  madocCustomComponentsPath = path.resolve(rootPath, madocComponentsPath);
  customComponents = require(madocCustomComponentsPath);
}
if (fs.existsSync(madocConfigPath)) {
  madocConfig = require(madocConfigPath);
}
madocConfig.dist = madocConfig.dist || 'dist';

const main = async (args) => {
  switch (args._[0]) {
    case 'init':
      const { todo } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'todo',
          message: 'Should I create this function to help you get started?',
          default: true
        }
      ]);
      console.info('TODO? ' + todo)
      return;
    case 'dev':
      dev(rootPath, madocConfig, customComponents);
      return;
    case 'build':
      await build(rootPath, madocConfig, customComponents);
      return;
    case 'serve':
      serve(path.resolve(process.cwd(), madocConfig.dist));
      return;
  }
};

(async () => {
  if (!argv._[0]) {
    console.info(notes.join('\n'));
    return;
  }
  await main(argv);
})();

module.exports.main = main;