const path = require('path');
const fs = require('fs-extra');
const c = require('ansi-colors');

const basePath = path.resolve(__dirname, '../');

if (basePath !== process.cwd()) {
  // Installed as dependency
  const thisPackage = require(path.resolve(__dirname, 'package.json'));
  const projectPackage = require(path.resolve(process.cwd(), 'package.json'));
  if (!projectPackage.devDependencies || !projectPackage.devDependencies.hasOwnProperty('svelte')) {
    console.error(`${c.red('Madoc needs Svelte as a devDependency.')}`);
    console.error(`${c.yellow(`Install by running: ${c.white(`npm install -D svelte@${thisPackage.devDependencies['svelte']}`)}`)}`);
  }
}

