import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import alias from '@rollup/plugin-alias';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import sveltePreprocess from 'svelte-preprocess';
import * as path from 'path';
import * as fs from 'fs';
import pkg from './package.json';
import { copySync, ensureFileSync, copyFileSync } from 'fs-extra';
import glob from 'glob';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const rootPath = process.env.MADOC_PATH || process.cwd();

const madocConfigPath = path.resolve(rootPath, 'madoc.config.js');
const madocComponentsPath = path.resolve(rootPath, './.madoc/components.js');

const stylePaths = [
	'src',
	'node_modules'
];

let madocConfig = {};
let customComponentsPath = '';
let buildDistPath;
let distPath;
if (fs.existsSync(madocConfigPath)) {
	madocConfig = require(madocConfigPath);
	madocConfig.dist = madocConfig.dist || 'dist';
	buildDistPath = path.resolve(rootPath, madocConfig.dist);
	distPath = dev ? path.resolve(__dirname, 'static') : buildDistPath;
	if (madocConfig.static) {
		for (const staticDir of madocConfig.static) {
			const staticDistPath = path.resolve(distPath, 'assets');
			if (fs.statSync(path.resolve(rootPath, staticDir)).isDirectory()) {
				copySync(path.resolve(rootPath, staticDir), staticDistPath);
			} else {
				const fileName = path.basename(staticDir);
				ensureFileSync(path.resolve(staticDistPath, fileName));
				copyFileSync(path.resolve(rootPath, staticDir), path.resolve(staticDistPath, fileName));
			}
		}
	}
}
if (fs.existsSync(madocComponentsPath)) {
	customComponentsPath = path.resolve(rootPath, madocComponentsPath);
	const customComponents = require(customComponentsPath);
	for (const component of customComponents) {
		component.copy(distPath, { path, copy: copySync });
	}
}

if (!customComponentsPath) {
	customComponentsPath = '../components/custom/index.js';
}

const onwarn = (warning, onwarn) => {
	return (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);
};

const preprocess = sveltePreprocess({
  scss: {
    includePaths: stylePaths
  },
  postcss: {
    plugins: [require('autoprefixer')]
  }
});

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		watch: {
			exclude: ['node_modules/**']
		},
		plugins: [
			{
        buildStart () {
					const watcher = path.resolve(rootPath, 'docs/**');
          glob(watcher, null, (err, files) => {
            files.forEach((file) => {
              this.addWatchFile(file);
            });
          });
        }
      },
			alias({
				entries: [
					{ find: 'custom-madoc-components', replacement: customComponentsPath }
				]
			}),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: true,
				preprocess
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				runtimeHelpers: true,
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),
			!dev && terser({
				module: true
			})
		],
		onwarn
	},
	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			alias({
				entries: [
					{ find: 'custom-madoc-components', replacement: customComponentsPath }
				]
			}),
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				generate: 'ssr',
				dev,
				preprocess
			}),
			resolve({
				dedupe: ['svelte']
			}),
			commonjs()
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),
		onwarn
	}
};
