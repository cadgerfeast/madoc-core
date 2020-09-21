const c = require('ansi-colors');

module.exports.Logger = class Logger {
  constructor (name) {
    this.name = name;
  }
  debug (msg) {
    console.debug(`[${c.gray('DEBUG')}] ${c.gray(this.getTimeStamp())} ${msg} - ${c.green(`{${this.name}}`)}`);
  }
  info (msg) {
    console.info(`[${c.cyan('INFO')}] ${c.gray(this.getTimeStamp())} ${msg} - ${c.green(`{${this.name}}`)}`);
  }
  warn (msg) {
    console.warn(`[${c.yellow('WARN')}] ${c.gray(this.getTimeStamp())} ${msg} - ${c.green(`{${this.name}}`)}`);
  }
  error (msg) {
    console.error(`[${c.red('ERROR')}] ${c.gray(this.getTimeStamp())} ${msg} - ${c.green(`{${this.name}}`)}`);
  }
  getTimeStamp () {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  }
};
