# 安装和使用

## 基本操作

1. 通过 npm 安装：

	```sh
	npm install nasa.js
	```

1. 在页面中引用 dist 文件（最终发行的打包文件）：

	```html
	<script src='./node_modules/nasa.js/dist/nasa.js'></script>
	<script>
	// use `Nasa` as a global variant
	alert(Nasa.ua.isSupported())
	</script>
	```

## 补充说明

* Nasa.js 一旦加载，就会对外暴露一个全局变量 `Nasa`。直接使用挂载在它身上的各个 API 即可。

* Nasa.js 的源码采用 ES6 模块管理，采用 ES6+ 语法。但并不建议以模块的方式引用其源码，因为 dist 文件包含了所有外部依赖，直接使用源码意味着需要操心外部依赖。建议使用者直接使用 dist 文件，并以全局变更的方式使用它。

* Nasa.js 目前并没有提供任何符合 CommonJS 模块规范的版本，因此不支持以 `require('nasa.js')` 的方式来引用，不支持 Browserify 打包。

## 常见问题

#### 如何把 Nasa.js 与其它脚本文件合并到一起？

方法一：可以使用简单的文件拼接方式，把 dist 文件与其它脚本文件合并。

方法二：如果你使用的打包工具支持 ES6 模块规范，可以把 dist 文件当作一个模块来引用，并打包到自己的 bundle 中。具体代码是这样的：

```js
import './node_modules/nasa.js/dist/nasa.js'
	
// use `Nasa` as a global variant
alert(Nasa.ua.isSupported())
```
