#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const c = require('ansi-colors');
const inquirer = require('inquirer');
const argv = require('yargs').argv;
const { spawn } = require('child_process');
const pkg = require('../package.json');

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

let madocConfig = {};
let madocConfigPath = path.resolve(process.cwd(), 'madoc.config.js');
if (fs.existsSync(madocConfigPath)) {
  madocConfig = require(madocConfigPath);
}
madocConfig.dist = madocConfig.dist || 'dist';

const _export = async (dest) => {
  const { build: _build } = (await import('sapper/dist/build.js')).default;
  await _build({
    cwd: '.',
    bunder: 'rollup',
    legacy: true,
    ext: '.svelte .html'
  });
  const { export: _export } = (await import('sapper/dist/export.js')).default;
  await _export({
    cwd: '.',
    static: 'static',
    build_dir: '__sapper__/build',
    export_dir: dest,
    concurrent: 8,
    entry: '/'
  });
};

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
      // TODO rewrite code
      spawn(`"${path.resolve("./node_modules/.bin/sapper")}"`, ['dev'], { stdio: 'inherit', shell: true, cwd: path.resolve(__dirname, '../'),  env: { MADOC_PATH: process.cwd() } })
        .on('exit', (code) => {
          process.exit(code);
        });
      return;
    case 'build':
      fs.emptyDirSync(path.resolve(process.cwd(), madocConfig.dist));
      await _export(path.resolve(process.cwd(), madocConfig.dist));
      console.info(c.green(`Documentation successfully built in ${c.cyan(madocConfig.dist)} folder.`));
      console.info(c.white(`Run ${c.yellow('madoc serve')} to check out the generated website.`));
      return;
    case 'serve':
      // TODO replace by express
      spawn(`"${path.resolve("./node_modules/.bin/serve")}"`, [path.resolve(process.cwd(), madocConfig.dist)], { stdio: 'inherit', shell: true, cwd: path.resolve(__dirname, '../') })
        .on('exit', (code) => {
          process.exit(code);
        });
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