const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const c = require('ansi-colors');
const marked = require('marked');
const Prism = require('prismjs');
const { JSDOM } = require('jsdom');
const { Logger } = require('../logger');

const logger = new Logger('config');

const madocPath = path.resolve(__dirname, '../../../');
const customComponentsPath = path.resolve(madocPath, 'src/components/custom');
const assetsPath = path.resolve(madocPath, 'public/assets');
let madocRootPath = process.cwd();

fs.emptyDirSync(customComponentsPath);

marked.setOptions({
	highlight: (code, lang) => {
		let hl;
    try {
			const prismLanguagePath = path.resolve(madocRootPath, `node_modules/prismjs/components/prism-${lang}.js`);
      if (fs.existsSync(prismLanguagePath)) {
				require(`prismjs/components/prism-${lang}`);
			}
			hl = Prism.highlight(code, Prism.languages[lang], lang);
    } catch (error) {
      hl = Prism.highlight(code, '', '');
    }
    return `<pre class="language-${lang}"><code class="language-${lang}">${hl}</code></pre>`;
	}
});

module.exports.getFileSystemConfig = (rootPath) => {
  fs.emptyDirSync(assetsPath);
  let rawConfig;
  if (fs.existsSync(path.resolve(rootPath, 'madoc.config.js'))) {
    // JS
    try {
      rawConfig = require(path.resolve(rootPath, 'madoc.config.js'));
      rawConfig.configPath = path.resolve(rootPath, 'madoc.config.js');
    } catch (error) {
      logger.error(`JavaScript error syntax on Madoc configuration file: ${c.yellow(path.resolve(rootPath, 'madoc.config.js'))}`);
      logger.error(error);
    }
  } else if (fs.existsSync(path.resolve(rootPath, 'madoc.config.json'))) {
    // JSON
    const fileContent = fs.readFileSync(path.resolve(rootPath, 'madoc.config.json'), 'utf8');
    try {
      rawConfig = JSON.parse(fileContent);
      rawConfig.configPath = path.resolve(rootPath, 'madoc.config.json');
    } catch (error) {
      logger.error(`JSON error syntax on Madoc configuration file: ${c.yellow(path.resolve(rootPath, 'madoc.config.json'))}`);
      logger.error(error);
    }
  }
  // TODO support YAML
  // TODO support package.json madoc
  rawConfig.rootPath = rootPath;
  madocRootPath = rootPath;
  return computeMadocConfig(rawConfig);
};

const computeMadocConfig = (rawConfig) => {
  const config = {
    title: 'Madoc',
    description: 'Markdown Documentation Framework',
    docsPath: 'docs',
    distPath: 'dist',
    components: [],
    head: [],
    watch: [],
    assets: [],
    ...rawConfig
  };
  computeMadocWatch(config);
  computeMadocDocs(config);
  computeMadocAssets(config);
  computeMadocComponents(config);
  computeMadocDocsPages(config);
  return config;
};

const computeMadocWatch = (config) => {
  for (let i = 0; i < config.watch.length; i++) {
    config.watch[i] = path.resolve(config.rootPath, config.watch[i]);
  }
};

const computeMadocAssets = (config) => {
  for (const a of config.assets) {
    if (fs.statSync(path.resolve(config.rootPath, a.src)).isDirectory()) {
      fs.copySync(path.resolve(config.rootPath, a.src), path.resolve(assetsPath, a.dest || ''));
    } else {
      fs.copyFileSync(path.resolve(config.rootPath, a.src), path.resolve(assetsPath, a.dest || path.basename(a.src)));
    }
  }
};

const computeMadocComponents = (config) => {
  let customContent = '';
  for (const c of config.components) {
    c.context = {};
    c.instance = 0;
    c.files = c.files || [];
    c.head = c.head || [];
    c.assets = c.assets || [];
    const fileName = path.basename(c.entry);
    if (fs.existsSync(path.resolve(c.rootPath, c.entry))) {
      customContent += `import './${fileName}';\n`;
      fs.copyFileSync(path.resolve(c.rootPath, c.entry), path.resolve(customComponentsPath, fileName));
    }
    config.head = [...c.head, ...config.head];
    for (const file of c.files) {
      if (fs.statSync(path.resolve(c.rootPath, file)).isDirectory()) {
        fs.copySync(path.resolve(c.rootPath, file), path.resolve(assetsPath, file));
      } else {
        fs.copyFileSync(path.resolve(c.rootPath, file), path.resolve(customComponentsPath, path.basename(file)));
      }
    }
    for (const asset of c.assets) {
      if (fs.statSync(path.resolve(c.rootPath, asset.src)).isDirectory()) {
        fs.copySync(path.resolve(c.rootPath, asset.src), path.resolve(assetsPath, asset.dest || ''));
      } else {
        fs.copyFileSync(path.resolve(c.rootPath, asset.src), path.resolve(assetsPath, asset.dest || path.basename(asset.src)));
      }
    }
  }
  const customComponentsEntryPath = path.resolve(customComponentsPath, 'index.js');
  if (fs.existsSync(customComponentsEntryPath)) {
    const customComponentsEntryContent = fs.readFileSync(customComponentsEntryPath, 'utf8');
    if (customComponentsEntryContent !== customContent) {
      fs.writeFileSync(customComponentsEntryPath, customContent);
    }
  } else {
    fs.writeFileSync(customComponentsEntryPath, customContent);
  }
};

const computeMadocDocs = (config) => {
  config.docsPath = path.resolve(config.rootPath, config.docsPath);
  config.distPath = path.resolve(config.rootPath, config.distPath);
  config.filePaths = getFilePathsInFolder(config.docsPath);
};

const computeMadocDocsPages = (config) => {
  const pages = {};
  for (const pagePath of config.filePaths) {
    pages[pagePath] = processMarkdownFile(pagePath, config);
  }
  config.pages = pages;
};

const processMarkdownFile = (pagePath, config) => {
  // TODO manage error
  const filePath = path.resolve(config.docsPath, `${pagePath}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
	const match = /---\n([\s\S]+?)\n---/.exec(fileContent);
	let content = fileContent.slice(match[0].length);
	const metadata = yaml.parse(match[1]);
	if (metadata.content) {
		content = fs.readFileSync(path.resolve(filePath, `../${metadata.content}`), 'utf8');
  }
  // Navbar
  if (metadata.navbar === undefined) {
    metadata.navbar = computeNavbar(filePath, config);
  }
  // Sidebar
  if (metadata.sidebar === undefined) {
    metadata.sidebar = computeSidebar(filePath, config);
  }
  // Content
  const vue = metadata.vue;
  const html = processMadoc(content, config, filePath);
	return { path: pagePath, metadata, html, vue };
};

const processMarkdownMetadataByFile = (filePath) => {
  // TODO manage error
  const fileContent = fs.readFileSync(filePath, 'utf8');
	const match = /---\n([\s\S]+?)\n---/.exec(fileContent);
	return yaml.parse(match[1]);
};

const computeNavbar = (filePath, config) => {
  // TODO manage error
  const navbarPath = path.resolve(filePath, '../_navbar.md');
  if (fs.existsSync(navbarPath)) {
    return processMarkdownMetadataByFile(navbarPath);
  } else if (filePath !== config.docsPath) {
    return computeNavbar(path.resolve(filePath, '../'), config);
  } else {
    return null;
  }
};

const computeSidebar = (filePath, config) => {
  // TODO manage error
  const navbarPath = path.resolve(filePath, '../_sidebar.md');
  if (fs.existsSync(navbarPath)) {
    return processMarkdownMetadataByFile(navbarPath);
  } else if (filePath !== config.docsPath) {
    return computeSidebar(path.resolve(filePath, '../'), config);
  } else {
    return null;
  }
};

const processMadoc = (markdown, config, filePath) => {
  const { document } = (new JSDOM(marked(markdown))).window;
  for (const component of config.components) {
    const els = document.getElementsByTagName(component.tag);
    for (const el of els) {
      if (el) {
        const attrs = {};
        for (const attribute of el.attributes) {
          attrs[attribute.name] = attribute.value;
        }
        el.setAttribute(':context', `getContext('${component.tag}', ${component.instance})`);
        component.context[component.instance] = component.parse({
          attrs,
          filePath,
          fn: {
            processMarkdownMetadataByFile
          }
        });
      }
      component.instance++;
    }
  }
  const root = document.createElement('div');
  root.innerHTML = document.getElementsByTagName('body')[0].innerHTML;
  return root.outerHTML;
};

const getFilePathsInFolder = (folderPath, parentPath = '', files = []) => {
  fs.readdirSync(folderPath).forEach((file) => {
    if (fs.statSync(path.resolve(folderPath, file)).isDirectory()) {
      let subParentPath = file;
      if (parentPath) {
        subParentPath = `${parentPath}/${file}`;
      }
      getFilePathsInFolder(path.resolve(folderPath, file), subParentPath, files);
    } else {
      const ext = file.split('.').pop();
      if (ext === 'md') {
        const fileName = file.slice(0, -3);
        if (fileName[0] !== '_') {
          if (parentPath) {
            files.push(`${parentPath}/${fileName}`);
          } else {
            files.push(fileName);
          }
        }
      }
    }
  });
  return files;
};
