const c = require('ansi-colors');
const express = require('express');

module.exports.serve = async (staticDir) => {
  const app = express();

  const port = 5000;

  app.use('/', express.static(staticDir));

  app.listen(port, function () {
    console.log(c.green(`Documentation is being served here: ${c.cyan(`http://localhost:${port}`)}`));
  });
};
