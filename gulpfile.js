'use strict'

const path = require('path')
const gulp = require('gulp')
const gulpfiles = require('gulpfiles')
const rename = require('gulp-rename')
const wrap = require('gulp-wrap')

const streamToPromise = require('gulp-stream-to-promise')

const myPath = {
	temp: './.tmp/',
	src: './src/',
	dest: './dist/',
}
const FILENAME = 'nasa'

const deps = {
	nebpay:   './vendor/nebPay.js',
	// blockies: './vendor/blockies.min.js',
}

const scripts = {
	[FILENAME + '.js']: [
		'./.tmp/nasa-raw.js',
	]
}
// combine external deps
Object.keys(deps).forEach(function (key) {
	scripts[FILENAME + '.js'].unshift(path.join(myPath.temp, key + '.js'))
})

const fs = require('fs')
const json = JSON.parse(fs.readFileSync('./package.json'))
const version = json.version
// console.log(version)

gulp.task('clean', gulpfiles.del({
	glob: path.join(myPath.dest, '*.*'),
}))

gulp.task('deps', function () {
	let tasks = []
	Object.keys(deps).forEach(function (key) {
		const src = deps[key]
		let stream = gulp.src(src)
			.pipe(wrap('*/\n<%= contents %>\n/*'))
			.pipe(wrap({src: path.join(myPath.src, '_wrapper/dep-' + key + '.js')}))
			.pipe(rename(key + '.js'))
			.pipe(gulp.dest(myPath.temp))
		tasks.push(streamToPromise(stream))
	})
	return Promise.all(tasks)
})

gulp.task('js', gulpfiles.concat({
	rules: scripts,
	dest: myPath.dest,
	config: {
		pipes: [
			{
				plugin: 'wrap',
				config: '*/\n<%= contents %>\n/*',
			},
			{
				plugin: 'wrap',
				config: {src: path.join(myPath.src, '_wrapper/dist-global.js')},
			},
			{
				plugin: 'replace',
				config: [/\/\*\* DEBUG_INFO_START \*\*\//g, '/*'],
			},
			{
				plugin: 'replace',
				config: [/\/\*\* DEBUG_INFO_END \*\*\//g, '*/'],
			},
			{
				plugin: 'replace',
				config: [/{{ version }}/g, version],
			},
			{
				plugin: 'uglify',
				rename: FILENAME + '.min.js',
				config: {
					preserveComments: 'some',
				},
			},
		]
	},
}))

gulp.task('readme', gulpfiles.concat({
	rules: {
		'README.md': ['./README.md'],
	},
	dest: './',
	config: {
		pipes: [
			{
				plugin: 'replace',
				config: [
					/cdn\.jsdelivr\.net\/npm\/nasa\.js@[0-9.]+\/dist\//g,
					`cdn\.jsdelivr\.net\/npm\/nasa\.js@${version}\/dist\/`,
				],
			},
		]
	},
}))

gulp.task('typing', gulpfiles.concat({
	rules: {
		'nasa.d.ts': [
			'./node_modules/bignumber.js/bignumber.d.ts',
			path.join(myPath.src, 'index.d.ts'),
		]
	},
	dest: './dist',
	config: {
		pipes: [
			{
				plugin: 'replace',
				config: [
					'import BigNumber from \'bignumber.js\'',
					'',
				],
			},
			{
				plugin: 'replace',
				config: [
					'export default BigNumber;',
					'',
				],
			},
			{
				plugin: 'replace',
				config: [
					/export interface/g,
					'interface',
				],
			},
			{
				plugin: 'replace',
				config: [
					/export class/g,
					'declare class',
				],
			}
		]
	}
}))

gulp.task('dist', gulp.series([
	'clean',
	'deps',
	'js',
	'readme',
	'typing',
]))
gulp.task('default', gulp.series('dist'))
