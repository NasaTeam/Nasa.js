const mix = require('laravel-mix')

// 获取开发环境所需的端口配置
const envConfig = require('dotenv').config()
envConfig.parsed = envConfig.parsed || {}
const WEB_PORT = envConfig.parsed.WEB_PORT || '8888'
const DEV_PORT = envConfig.parsed.DEV_PORT || '3098'

mix.disableNotifications()
mix.options({
	uglify: {
		uglifyOptions: {
			ie8: true,
		},
	},
	autoprefixer: {
		options: {
			browsers: [
				'Android >= 5',
				'iOS >= 10',
				'Chrome >= 35',
				'Firefox >= 56',
				'Safari >= 11',
				'Explorer >= 11',
			],
		},
	},
	processCssUrls: false,
})

if (process.env.MIX_MODE === 'watch') {
	// static web server
	const express = require('express')
	const app = express()
	app.use(express.static('./'))
	app.get('/', function (req, res) {
		res.redirect('/demo/')
	})
	app.listen(WEB_PORT, function () {
		console.log(`[Nasa.js] Static web server running on port ${WEB_PORT}!\n`)
	})

	mix.browserSync({
		proxy: 'localhost:' + WEB_PORT,
		port: DEV_PORT,
		ui: false,
		ghostMode: false,
		logLevel: 'debug',
		files: [
			'./demo/*.html',
			'./demo/*.css',
			'./demo/*.js',
			'./dist/**/*.js',
			'./.tmp/nasa*.js',
		],
		// notify: false,
		browser: [],
	})
}

// tasks - js
mix.js('./src/index.js', './.tmp/nasa-raw.js')

// task - demo - js
mix.combine([
	'./node_modules/underscore/underscore.js',
	'./node_modules/zepto.js/dist/zepto.js',
	'./node_modules/cmui-gearbox/dist/gearbox.js',
	'./node_modules/cmui/dist/cmui.js',
], './demo/lib.js')

// task - demo - css
mix.stylus('./demo/src/index.styl', './demo/')

