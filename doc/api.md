## 概述

#### 总体设计

* 纯静态的 API 设计风格。除了极度常用的几个核心 API 以外，常规 API 都采用 `Nasa.module.method()` 这样的命名方式。

* All-in-One 的打包方式。把所有外部依赖打包到在一起，对外暴露一个全局变量 `Nasa`。不公开支持以模块的方式引用源码，建议使用者直接使用 dist 文件。

#### 文档约定
 
* 如果某个 API 未描述 “返回值”，则表示它没有返回值；如果未描述 “参数”，则表示不需要参数。

* 在某个 API（比如 `Nasa.module.method()`）的描述中，当提及自身时，可能会省略其命名空间，只写成 `.method()`。

* `.foo(bar = 1)` 表示 `foo` 方法的参数 `bar` 有默认值（`1`），因此可省略。


## 依赖库

所有外部依赖都会被打包进 Nasa.js 的 dist 文件中，你可以通过以下属性引用它们。

### `Nasa.nebPay`

[nebPay](https://github.com/nebulasio/nebPay) 的 API 命名空间。无需实例化，直接使用即可：

```js
Nasa.nebPay.pay(to, value, options)
```

### `Nasa.BigNumber`

[BigNumber](https://github.com/MikeMcl/bignumber.js) 构造函数。

```js
// create an instance of a BigNumber object
const value = Nasa.BigNumber(123.4567)

// config BigNumber
Nasa.BigNumber.config({ ROUNDING_MODE: 0 })
```


## 常量 <a name="const">&nbsp;</a>

当你需要输出或匹配一些固定值时，不如直接引用 Nasa.js 帮你定义好的常量，以免拼写错误。

### 错误信息

* `Nasa.error.NETWORK_ERROR` -- 网络错误
* `Nasa.error.SERVER_ERROR` -- 服务器错误
* `Nasa.error.REQUEST_TIMEOUT` -- 请求超时
* `Nasa.error.TX_REJECTED_BY_USER` -- 交易被用户取消
* `Nasa.error.EXTENSION_NOT_INSTALLED` -- “星云钱包 Chrome 扩展” 未安装
* `Nasa.error.EXTENSION_TIMEOUT` -- “星云钱包 Chrome 扩展” 响应超时

### 环境名 <a name="const--env">&nbsp;</a>

* `Nasa.env.MAIN` -- `'mainnet'`
* `Nasa.env.TEST` -- `'testnet'`
* `Nasa.env.LOCAL` -- `'local'`
* `Nasa.env.MAINNET` -- `Nasa.env.MAIN` 的别名
* `Nasa.env.TESTNET` -- `Nasa.env.TEST` 的别名


## 核心功能 <a name="core">&nbsp;</a>

### `Nasa.call(contractAddr, fnName, args = [], options = {})` <a name="core--call">&nbsp;</a>

调用合约方法，并向链写入数据，因此需要以交易的方式实现（一般称作 “写入型调用” 或 “交易型调用”）。

#### 参数

* `contractAddr` -- 字符串。合约地址。如果你用 [`Nasa.contract.set()`](#contract--set) API 配置了合约，则这里也可以传入合约名；如果你配置了默认合约，且此参数为空值或假值时，将取默认合约。
* `fnName` -- 字符串。合约方法名。
* `args` -- 数组。传给合约方法的参数。
* `options` -- 对象。附加选项。可选的 key 如下：
	* `value` -- 字符串。转账数额（单位 NAS）。

#### 返回值

Promise。处理结果如下：

* Fulfilled：字符串。交易流水号，可通过 [`Nasa.checkTx()`](#core--checkTx) 查询交易状态和调用结果。
* Rejected：
	* 当参数错误时抛 xxx 错误
	* 用户取消时抛 xxx 错误
	* 网络错误时抛 xxx 错误
	* 合约执行错误时抛 xxx 错误

### `Nasa.query(contractAddr, fnName, args = [])`

向合约查询数据，不需要向链写入数据，因此不需要发起交易（一般称作 “读取型调用” 或 “查询型调用”）。

#### 参数

（同 [`Nasa.call()`](#core--call) 的参数）

#### 返回值

Promise。处理结果如下：

* Fulfilled：对象。调用结果。
* Rejected：
	* 当参数错误时抛 xxx 错误
	* 网络错误时抛 xxx 错误
	* 合约执行错误时抛 xxx 错误


### `Nasa.checkTx(payId)` <a name="core--checkTx">&nbsp;</a>

查询交易结果。

#### 参数

* `payId` -- 字符串。交易流水号。<!-- 如果此参数为空值或假值，则取最后一次交易的交易号。-->

#### 返回值

Promise。处理结果如下：

* Fulfilled：对象。交易详细信息。
* Rejected：
	* 当参数错误时抛 xxx 错误
	* 网络错误时抛 xxx 错误
	* 合约执行错误时抛 xxx 错误

### ~~`Nasa.pay(addr, value = '0')`~~

> ⚠️ 计划中，暂未实现！

向指定用户转账。

#### 参数

* `addr` -- 字符串。接收方的钱包地址。
* `value` -- 字符串。转账数额（单位 NAS）。

#### 返回值

（同 [`Nasa.call()`](#core--call) 的返回值）

## 合约 <a name="contract">&nbsp;</a>

你的 DApp 可能会用到多个环境下的多个合约，因此建议你使用 Nasa.js 来帮助你管理合约地址。

### `Nasa.contract.set(config)` <a name="contract--set">&nbsp;</a>

配置 DApp 所需要的合约地址，便于管理和使用。你需要为每个合约起个名字——如果你有起名困难症，也可以使用 `'contract1'` 这样的名字，只要你记得谁是谁就行。

可配置多个合约。建议至少要有一个默认合约（名为 `'default'`）——这样其它 API 就可以自动找到这个默认合约了，无需你手动指定。

#### 参数

* `config ` -- 对象。具体格式见示例。

#### 示例

假设你在写一个博客应用，需要用到三个合约（分别用于实现主逻辑、处理文章、处理评论），同时每个合约拥有三个版本（本地环境、测试网、主网），则可以像这样把它们管理起来：

```js
Nasa.contract.set({
	default: {
		local:   '...contract...addr...',
		testnet: '...contract...addr...',
		mainnet: '...contract...addr...',
	},
	contract_article: {
		...
	},
	contract_comment: {
		...
	}
})
```

### `Nasa.contract.get(contractName = 'default')` <a name="contract--get">&nbsp;</a>

获取指定名称的合约的地址。

#### 参数

* `contractName ` -- 字符串。合约名称。如果此参数为空值或假值，则取 `'default'`。

#### 返回值

合约地址。此 API 会自动匹配 “当前环境”——即你通过 [`Nasa.env.set()`](#env--set) API 指定的环境。

## 环境配置

### `Nasa.env.set(envName)` <a name="env--set">&nbsp;</a>

设置当前环境。

如果不指定通过此 API 指定当前环境，则默认运行于主网环境。

#### 参数

* `envName` -- 字符串。环境名。取值参见 [“常量 → 环境名”](#const--env) 段落。

### `Nasa.env.get()`

获取当前环境。

其它 API 会用到此 API，比如 [`Nasa.contract.get()`](#contract--get)。

## 用户

### `Nasa.user.getAddr()`

获取当前用户的钱包地址。此功能依赖 “星云钱包 Chrome 扩展” 来实现，因此只在 PC 端有效；如果扩展移除了相关接口，则此 API 也将失效。

#### 返回值

Promise。处理结果如下：

* Fulfilled：字符串。用户地址。

* Rejected：

	错误原因 | 错误消息
	---|---
	当前浏览器不是桌面版 Chrome | `Nasa.error.EXTENSION_NOT_INSTALLED`
	当前浏览器没有安装 “星云钱包 Chrome 扩展” | `Nasa.error.EXTENSION_NOT_INSTALLED`
	“星云钱包 Chrome 扩展” 没有导入钱包 | `Nasa.error.EXTENSION_TIMEOUT`
	“星云钱包 Chrome 扩展” 不再支持此功能 | `Nasa.error.EXTENSION_TIMEOUT`

### ~~`Nasa.user.getAvatar(addr)`~~

> ⚠️ 计划中，暂未实现！

获取指定用户的头像。头像生成算法与 “星云钱包 Chrome 扩展” 一致。

#### 参数

* `addr` -- 字符串。钱包地址。

#### 返回值

* 字符串。采用 Base64 编码的图片数据，并已加 `data:` 协议前缀。可以直接填充到 `<img>` 元素的 `src` 属性，也可以赋值给元素的 `.style.backgroundImage` 属性。

## 浏览器环境

### `Nasa.ua.isSupported()`

#### 返回值

布尔值。当前浏览器是否可以正常运行 Nasa.js。基于特性检测来判断。

> 注：目前 Ajax 由 `Fetch()` API 实现，可能不支持部分老浏览器。在后续的版本中，可能会把 Ajax 的实现换成 XHR，以提升兼容性。

### `Nasa.ua.isMobileDevice()`

#### 返回值

布尔值。当前浏览器是否运行于移动设备。基于 User Agent 字符串来判断。

所有 Android 和 iOS 设备（包括 iPad）都会被视为移动设备。

### `Nasa.ua.isDesktopDevice()`

#### 返回值

布尔值。当前浏览器是否运行于桌面设备。基于 User Agent 字符串来判断。

非移动设备，即被视为桌面设备。

### `Nasa.ua.isDesktopChrome()`

#### 返回值

布尔值。当前浏览器是否是桌面版 Chrome。基于 User Agent 字符串来判断。

### `Nasa.ua.isWeChat()`

#### 返回值

布尔值。当前浏览器是否是微信。基于 User Agent 字符串来判断。

### `Nasa.ua.isWalletExtensionInstalled()`

#### 返回值

布尔值。判断 “星云钱包 Chrome 扩展” 是否已安装。

> 注：此功能依赖扩展向页面中注入的脚本来判断，而由于扩展注入脚本需要一点点时间，因此，在页面最顶部运行此 API 不一定会得到正确的结果。

### ~~`Nasa.ua.isWalletMobileAppInstalled([status])`~~

> ⚠️ 计划中，暂未实现！

运行在手机浏览器中的页面实际上无从判断 “星云手机钱包 App” 是否已安装，因此，作为开发者，只能向用户询问是否已安装，记住用户的回答，然后走向不同的分支流程。

这个 API 帮助开发者记住用户的回答，有 getter 与 setter 两种模式。

* Setter： `.isWalletMobileAppInstalled(status)`

	保存用户的回答。
	
	**参数**： `status` -- 布尔值。用户是否声称自己已安装 “星云手机钱包 App”。

* Getter： `.isWalletMobileAppInstalled()`

	获取已保存的回答。

	**返回值**：
	
	* `true` -- 之前保存过的用户的回答：已安装
	* `false` -- 之前保存过的用户的回答：未安装
	* `undefined` -- 之前没有保存过用户的回答

> 注：此 API 通过本地存储作为持久化存储。


## 工具方法

### `Nasa.util.isValidAddr(str)`

判断是否是合法的地址（钱包地址或合约地址）。

#### 参数

* `str ` -- 字符串。待检测的地址。

#### 返回值

布尔值。是否合法。

### `Nasa.util.isValidTxHash(str)`

判断是否是合法的 TxHash（交易哈希）。

#### 参数

* `str ` -- 字符串。待检测的 TxHash。

#### 返回值

布尔值。是否合法。

### `Nasa.util.isValidPayId(str)`

判断是否是合法的交易流水号。

#### 参数

* `str ` -- 字符串。待检测的交易流水号。

#### 返回值

布尔值。是否合法。

***

## 事件 <a name="event">&nbsp;</a>

（设计中，欢迎 [提需求](https://github.com/cssmagic/Nasa.js/issues/new)）

