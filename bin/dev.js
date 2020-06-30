const fs = require('fs-extra');
const path = require('path');
const c = require('ansi-colors');

const wait_frame = async (frames = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, frames);
  });
}

const format_milliseconds = (ms) => {
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;

	const minutes = ~~(ms / 60000);
	const seconds = Math.round((ms % 60000) / 1000);
	return `${minutes}m${seconds < 10 ? '0' : ''}${seconds}s`;
}

module.exports.dev = async () => {
  const { dev: _dev } = (await import('sapper/dist/dev.js')).default;
  try {
    process.env.MADOC_PATH = process.cwd();
    process.chdir(path.resolve(__dirname, '../'));
    const watcher = _dev({
      cwd: '.',
      bundler: 'rollup'
    });
    let first = true;
    watcher.on('stdout', data => {
      process.stdout.write(data);
    });
    watcher.on('stderr', data => {
      process.stderr.write(data);
    });
    watcher.on('ready', async (event) => {
      if (first) {
        console.log(c.cyan(`> Listening on http://localhost:${event.port}`));
        first = false;
      }
    });
    watcher.on('invalid', async (event) => {
      const changed = event.changed.map(filename => path.relative(process.cwd(), filename)).join(', ');
      console.log(`\n${c.cyan(changed)} changed. rebuilding...`);
      await wait_frame(500);
      watcher.dev_server.send({
        action: 'reload'
      });
    });
    watcher.on('error', (event) => {
      const { type, error } = event;
      console.log(c.red(`✗ ${type}`));
      if (error.loc && error.loc.file) {
        console.log(c(`${path.relative(process.cwd(), error.loc.file)} (${error.loc.line}:${error.loc.column})`));
      }
      console.log(c.red(event.error.message));
      if (error.frame) console.log(error.frame);
    });
    watcher.on('fatal', (event) => {
      console.log(c.red(`> ${event.message}`));
      if (event.log) console.log(event.log);
    });
    watcher.on('build', (event) => {
      if (event.errors.length) {
        console.log(c.red(`✗ ${event.type}`));
        event.errors.filter(e => !e.duplicate).forEach(error => {
          if (error.file) console.log(c.white(error.file));
          console.log(error.message);
        });
        const hidden = event.errors.filter(e => e.duplicate).length;
        if (hidden > 0) {
          console.log(`${hidden} duplicate ${hidden === 1 ? 'error' : 'errors'} hidden\n`);
        }
      } else if (event.warnings.length) {
        console.log(c.yellow(`• ${event.type}`));
        event.warnings.filter(e => !e.duplicate).forEach(warning => {
          if (warning.file) console.log(c.white(warning.file));
          console.log(warning.message);
        });
        const hidden = event.warnings.filter(e => e.duplicate).length;
        if (hidden > 0) {
          console.log(`${hidden} duplicate ${hidden === 1 ? 'warning' : 'warnings'} hidden\n`);
        }
      } else {
        console.log(`${c.green(`✔ ${event.type}`)} ${c.gray(`(${format_milliseconds(event.duration)})`)}`);
      }
    });
  } catch (err) {
    console.log(c.red(`> ${err.message}`));
    console.log(c.gray(err.stack));
    process.exit(1);
  }
};
