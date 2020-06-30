const fs = require('fs-extra');
const path = require('path');
const c = require('ansi-colors');

const _export = async (cwd, dest) => {
  process.chdir(cwd);
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

module.exports.build = async (rootPath, madocConfig, customComponents = []) => {
  const distPath = path.resolve(process.cwd(), madocConfig.dist);
  fs.emptyDirSync(distPath);
  process.env.MADOC_PATH = process.cwd();
  await _export(path.resolve(__dirname, '../'), distPath);
  if (madocConfig.static) {
    for (const staticDir of madocConfig.static) {
      staticDir.dest = staticDir.dest || '';
      const staticDistPath = path.resolve(distPath, `assets/${staticDir.dest}`);
      if (fs.statSync(path.resolve(rootPath, staticDir.src)).isDirectory()) {
        fs.copySync(path.resolve(rootPath, staticDir.src), staticDistPath);
      } else {
        const fileName = path.basename(staticDir.src);
        fs.ensureFileSync(path.resolve(staticDistPath, fileName));
        fs.copyFileSync(path.resolve(rootPath, staticDir.src), path.resolve(staticDistPath, fileName));
      }
    }
  }
  for (const component of customComponents) {
    component.copy(rootPath, distPath, { path, copy: fs.copySync });
  }
  console.info(c.green(`Documentation successfully built in ${c.cyan(madocConfig.dist)} folder.`));
  console.info(c.white(`Run ${c.yellow('madoc serve')} to check out the generated website.`));
};
