const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');
const { getFileSystemConfig } = require('./src/helpers/config/node');
const dev = process.env.NODE_ENV === 'development';

const rootPath = process.env.MADOC_PATH || process.cwd();
const madocConfig = getFileSystemConfig(rootPath);

// TODO should not have to reload everything in order to dev
// TODO if config changes, set a warning that new madoc dev should be reloaded

if (dev) {
  const hotReloadFile = path.resolve(__dirname, 'public/index.html');
  const watcher = chokidar.watch([
    madocConfig.configPath,
    madocConfig.docsPath
  ], {
    persistent: true,
    ignoreInitial: true
  });
  watcher.on('add', () => {
    const content = fs.readFileSync(hotReloadFile, 'utf8');
    fs.writeFileSync(hotReloadFile, content);
  });
  watcher.on('change', () => {
    const content = fs.readFileSync(hotReloadFile, 'utf8');
    fs.writeFileSync(hotReloadFile, content);
  });
  watcher.on('unlink', () => {
    const content = fs.readFileSync(hotReloadFile, 'utf8');
    fs.writeFileSync(hotReloadFile, content);
  });
}

module.exports = {
  productionSourceMap: dev,
  lintOnSave: true,
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
      defs[0]['process.env'].madocConfig = JSON.stringify(madocConfig);
      return defs;
    });
  }
};
