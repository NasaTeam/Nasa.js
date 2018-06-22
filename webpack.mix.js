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
				'Android >= 4.4',
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
		ui: false,
		port: 3098,
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
mix.js('./src/index.js', './.tmp/nasa-core.js')

// task - demo - css
mix.stylus('./demo/src/index.styl', './demo/')

