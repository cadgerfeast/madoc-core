const webpack = require('webpack');
const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');
const { getFileSystemConfig } = require('./src/helpers/config/node');
const { Logger } = require('./src/helpers/logger');
const c = require('ansi-colors');
const dev = process.env.NODE_ENV === 'development';

const logger = new Logger('madoc');

const rootPath = process.env.MADOC_PATH || process.cwd();
const madocConfig = getFileSystemConfig(rootPath);

const computeMadocConfiguration = () => {
  return JSON.stringify(getFileSystemConfig(rootPath));
};

if (dev) {
  const hotReloadFile = path.resolve(__dirname, 'public/index.html');
  const configWatch = chokidar.watch([
    madocConfig.configPath
  ], {
    persistent: true,
    ignoreInitial: true
  });
  configWatch.on('change', () => {
    logger.warn(`Madoc configuration has been modified, you have to run ${c.cyan('madoc dev')} again.`);
  });
  const docsWatcher = chokidar.watch([
    madocConfig.docsPath,
    ...madocConfig.watch
  ], {
    persistent: true,
    ignoreInitial: true
  });
  docsWatcher.on('add', () => {
    const content = fs.readFileSync(hotReloadFile, 'utf8');
    fs.writeFileSync(hotReloadFile, content);
  });
  docsWatcher.on('change', () => {
    const content = fs.readFileSync(hotReloadFile, 'utf8');
    fs.writeFileSync(hotReloadFile, content);
  });
  docsWatcher.on('unlink', () => {
    const content = fs.readFileSync(hotReloadFile, 'utf8');
    fs.writeFileSync(hotReloadFile, content);
  });
}

module.exports = {
  productionSourceMap: dev,
  lintOnSave: false,
  pwa: {
    name: madocConfig.title
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = madocConfig.title;
      args[0].description = madocConfig.description;
      args[0].head = madocConfig.head.join('\n');
      return args;
    });
    config.plugin('define').tap((defs) => {
      defs[0]['process.env'].madocConfig = webpack.DefinePlugin.runtimeValue(computeMadocConfiguration, true);
      return defs;
    });
  }
};
