const express = require('express');
const c = require('ansi-colors');
const { getFileSystemConfig } = require('../config/node');
const { Logger } = require('../logger');

const logger = new Logger('cli/serve');

const serve = (port, config) => {
  const app = express();

  app.use('/', express.static(config.distPath));

  app.listen(port, function () {
    logger.info(`Documentation is being served here: ${c.cyan(`http://localhost:${port}`)}`);
  });
};

if (require.main === module) {
  const rootPath = process.env.MADOC_PATH || process.cwd();
  const madocConfig = getFileSystemConfig(rootPath);
  serve(5001, madocConfig);
}
module.exports.serve = serve;
