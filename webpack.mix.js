const mix = require('laravel-mix')

const envConfig  = require('dotenv').config()

//设置全局参数
const program = {
    MIX_PROXY : envConfig.parsed.MIX_PROXY,	// BrowserSync 所用的代理
    production : process.env.NODE_ENV === 'production',	// 是否生产环境
}

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

if (program.MIX_PROXY) {
	mix.browserSync({
		proxy: program.MIX_PROXY,
		port: 3098,
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
mix.copy('./dist/nasa.js', './demo/')
mix.copy('./node_modules/nebpay.js/dist/nebPay.js', './vendor/')

// task - demo - css
mix.stylus('./demo/src/index.styl', './demo/')

