const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const c = require('ansi-colors');
const marked = require('marked');
const Prism = require('prismjs');
const { Logger } = require('../logger');

const logger = new Logger('config');

const madocPath = path.resolve(__dirname, '../../../');
const nodeModulesPath = path.resolve(madocPath, 'node_modules');
const customComponentsPath = path.resolve(madocPath, 'src/components/custom');
const assetsPath = path.resolve(madocPath, 'public/assets');

fs.emptyDirSync(customComponentsPath);
fs.emptyDirSync(assetsPath);

marked.setOptions({
	highlight: (code, lang) => {
		let hl;
    try {
			const prismLanguagePath = path.resolve(nodeModulesPath, `prismjs/components/prism-${lang}.js`);
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

let _config;

module.exports.getFileSystemConfig = (rootPath) => {
  let rawConfig;
  if (!_config) {
    // JS
    if (fs.existsSync(path.resolve(rootPath, 'madoc.config.js'))) {
      try {
        rawConfig = require(path.resolve(rootPath, 'madoc.config.js'));
        rawConfig.configPath = path.resolve(rootPath, 'madoc.config.js');
      } catch (error) {
        logger.error(`JavaScript error syntax on Madoc configuration file: ${c.yellow(path.resolve(rootPath, 'madoc.config.js'))}`);
        logger.error(error);
      }
    }
    // JSON
    if (fs.existsSync(path.resolve(rootPath, 'madoc.config.json'))) {
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
    _config = computeMadocConfig(rawConfig);
  }
  return _config;
};

const computeMadocConfig = (rawConfig) => {
  const config = {
    title: 'Madoc',
    description: 'Markdown Documentation Framework',
    docsPath: 'docs',
    distPath: 'dist',
    components: [],
    head: [],
    assets: [],
    ...rawConfig
  };
  computeMadocDocs(config);
  computeMadocAssets(config);
  computeMadocComponents(config);
  computeMadocDocsPages(config);
  return config;
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
    const fileName = path.basename(c.entry);
    customContent += `import './${fileName}';\n`;
    fs.copyFileSync(path.resolve(c.rootPath, c.entry), path.resolve(customComponentsPath, fileName));
    config.head = [...c.head, ...config.head];
    for (const asset of c.assets) {
      if (fs.statSync(path.resolve(c.rootPath, asset.src)).isDirectory()) {
        fs.copySync(path.resolve(c.rootPath, asset.src), path.resolve(assetsPath, asset.dest || ''));
      } else {
        fs.copyFileSync(path.resolve(c.rootPath, asset.src), path.resolve(assetsPath, asset.dest || path.basename(asset.src)));
      }
    }
  }
  fs.writeFileSync(path.resolve(customComponentsPath, 'index.js'), customContent);
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
  const sections = processMadoc(content, config, filePath);
	return { path: pagePath, metadata, sections };
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
  const sections = [];
	let stringBuffer = '';
	for (const line of markdown.split('\n')) {
		let hasCustom = false;
		for (const component of config.components) {
			if (line.startsWith(`[${component.tag}]`)) {
				hasCustom = true;
				sections.push({
					type: 'md',
					content: marked(stringBuffer)
        });
        sections.push({
					type: component.tag,
					content: component.parse(line, {
            filePath,
            fn: {
              processMarkdownMetadataByFile
            }
          })
				});
				stringBuffer = '';
			}
		}
		if (!hasCustom) {
			stringBuffer += `${line}\n`;
		}
	}
	if (stringBuffer) {
		sections.push({
			type: 'md',
			content: marked(stringBuffer)
		});
	}
	return sections;
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
