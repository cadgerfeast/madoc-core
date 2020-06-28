import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import marked from 'marked';
import Prism from 'prismjs';

const madocCorePath = path.resolve(__dirname, '../../..')

marked.setOptions({
	highlight: (code, lang) => {
		let hl;
    try {
			const prismLanguagePath = path.resolve(madocCorePath, `node_modules/prismjs/components/prism-${lang}.js`);
			if (fs.existsSync(prismLanguagePath)) {
				import(`prismjs/components/prism-${lang}`);
			}
			hl = Prism.highlight(code, Prism.languages[lang], lang);
    } catch (error) {
      hl = Prism.highlight(code, '', '');
    }
    return `<pre class="language-${lang}"><code class="language-${lang}">${hl}</code></pre>`;
	}
});

const rootPath = process.env.MADOC_PATH || process.cwd();

const madocPath = path.resolve(rootPath, 'docs');
const madocConfigPath = path.resolve(rootPath, 'madoc.config.js');
const madocComponentsPath = path.resolve(rootPath, './.madoc/components.js');

let madocConfig = {
	head: []
};
let madocCustomComponents = [];
if (fs.existsSync(madocConfigPath)) {
	madocConfig = require(madocConfigPath);
}
if (fs.existsSync(madocComponentsPath)) {
	madocCustomComponents = require(madocComponentsPath);
	for (const component of madocCustomComponents) {
		madocConfig.head = madocConfig.head || [];
		madocConfig.head = [
			...madocConfig.head,
			...component.head
		];
	}
}

export const processMarkdown = (markdown) => {
	const match = /---\n([\s\S]+?)\n---/.exec(markdown);
	let content = markdown.slice(match[0].length);
	const metadata = yaml.load(match[1]);
	if (metadata.content) {
		content = fs.readFileSync(path.resolve(rootPath, `./docs/${metadata.content}`), 'utf8');
	}
	return { metadata, content };
};

export const processMetadataFromFile = (filePath) => {
	const finalPath = path.resolve(madocPath, filePath);
	if (fs.existsSync(finalPath)) {
		const markdown = fs.readFileSync(finalPath, 'utf8');
		const { metadata } = processMarkdown(markdown);
		return metadata;
	}
};

export const getPage = (pagePath) => {
	const filePath = path.resolve(madocPath, `./${pagePath}.md`);
	if (fs.existsSync(filePath)) {
		const markdown = fs.readFileSync(filePath, 'utf8');
		const { metadata, content } = processMarkdown(markdown);
		return {
			...metadata,
			sections: processMadoc(content, path.resolve(filePath, '..'))
		};
	}
};

export const request = (slug, option) => {
	switch (slug) {
		case 'index':
			return getPage(slug);
		case '_sitemap':
			return getSitemap();
		case '_config':
			return {
				config: parseConfig(madocConfig),
				navbar: processMetadataFromFile('_navbar.md'),
				sidebar: processMetadataFromFile('_sidebar.md')
			};
		default:
			return getPage(option);
	}
};

export function getSitemap () {
	return walkFolder(madocPath);
}

export const walkFolder = (folder, array) => {
	const files = fs.readdirSync(folder);
	array = array || [];
	for (const file of files) {
		if (fs.statSync(folder + '/' + file).isDirectory()) {
			walkFolder(folder + '/' + file, array);
		} else {
			if (isMadocPage(file)) {
				array.push(path.relative(madocPath, folder + '/' + file.slice(0, -3)).replace(/\\/g, '/'));
			}
		}
	}
	return array;
}

export const isMadocPage = (file) => {
	return (
		file.split('/').pop() !== '_navbar.md' &&
		file.split('/').pop() !== '_sidebar.md' &&
		file.split('/').pop() !== 'metadata.md' &&
		file.split('.').pop() === 'md'
	);
}

const getDirName = (filePath) => {
	return path.dirname(path.resolve(madocPath, filePath));
};

const getFileContent = (filePath) => {
	return fs.readFileSync(path.resolve(madocPath, filePath), 'utf8');
};

const processMadoc = (markdown, filePath) => {
	const sections = [];
	let stringBuffer = '';
	for (const line of markdown.split('\n')) {
		let hasCustom = false;
		for (const customComponent of madocCustomComponents) {
			if (line.startsWith(`[${customComponent.tag}]`)) {
				hasCustom = true;
				sections.push({
					type: 'md',
					content: marked(stringBuffer)
				});
				sections.push({
					type: customComponent.tag,
					content: customComponent.parse(line, {
						filePath,
						path,
						processMetadataFromFile,
						getFileContent,
						getDirName
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

const parseConfig = (config) => {
	const _config = { ...config };
	return _config;
};
