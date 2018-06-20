# Nasa.js

> Lightweight and friendly util library for DApp development on Nebulas Blockchain.
> 
> 星云链 DApp 客户端开发框架，轻量，易用。

## 安装和使用

可通过 npm 安装：

```sh
npm install nasa.js
```

* 详细的使用说明参见 ~~此文档~~。
* 完整的 API 文档详见 ~~此文档~~。

## 存在的意义是什么？

> 星云官方 JS SDK（neb.js 和 nebPay）功能完备，我为什么还要使用 Nasa.js？

* **平衡**：Nasa.js 追求 “功能” 与 “体积” 之间的最佳平衡——用小巧的体积实现 90% 的 DApp 功能需求，满足你对网页性能的极致追求。

* **友好**：专为 Web 前端工程师设计，把常见场景封装为高层 API，符合你的直觉和开发习惯。

功 能 | neb.js<br><sup>完整版</sup> | neb.js<br><sup>基础版</sup> | nebPay | Nasa.js
---|---|---|---|---
完整对接星云 HTTP 接口 |  ✓ | 
支付 | ✓ |  | ✓ <sup>[1]</sup> | ... <sup>[1]</sup> <sup>[2]</sup>
部署合约  |  ✓ | 
调用合约（写入数据） | ✓ |  | ✓ <sup>[1]</sup> | ✓ <sup>[1]</sup>
调用合约（查询数据） | ✓ | ✓ | ✓ <sup>[2]</sup> <sup>[3]</sup> | ✓
查询交易状态 | ✓ |  ✓ | ✓ | ✓
获取当前用户钱包地址 |  |   |  | ✓ <sup>[1]</sup>
兼容移动端 <sup>[4]</sup>  |   |  | ✓ | ✓
管理合约地址与当前环境 |  |  |  | ✓
分析当前浏览器环境 |   |  |  | ✓
常用工具方法 <sup>[5]</sup> |   |  |  | ✓
| |
文件体积 <sup>[9]</sup> | 155 KiB | 9.7 KiB | 21 KiB| ≤ 40 KiB<br><sup>（开发中）</sup>

> * <sup>[1]</sup> 此功能依赖 “星云钱包 Chrome 扩展” 实现。
> * <sup>[2]</sup> 此功能在开发计划中，后续版本很快支持。
> * <sup>[3]</sup> 此功能将被弃用。
> * <sup>[4]</sup> 支持在手机浏览器（iOS Safari 或 Android Chrome 等）中调用 “星云手机钱包 App” 完成交易。
> * <sup>[5]</sup> 包括判断地址、TxHash、交易流水号是否合法等工具方法。
> * <sup>[9]</sup> 包含所有外部依赖的 dist 文件在 min + Gzip 之后的体积。

## 谁在用？

* [我是预言帝](http://dapp.applinzi.com/predictor/) —— 基于 Nasa.js 的未发布版本

## 常见问题

#### Nasa.js 到底是 “library” 还是 “框架”？

Nasa.js 提供了丰富的 API，你可以把它当作库来用，只在你需要的时候调用某几个 API。你也可以让它帮你管理合约地址和当前环境，此时 Nasa.js 将为你提供更多便利，就像一个框架那样。

未来，Nasa.js 将为常见开发场景提供更完整的解决方案，成为一个更加称职的开发框架。

#### 使用 Nasa.js 还需要加载 neb.js 和 nebPay 吗？

Nasa.js 的 dist 文件已经把所有外部依赖都打包进来了，因此可以独立使用。

#### 我的 DApp 已经加载了 neb.js 和 nebPay 了，可以同时使用 Nasa.js 吗？

在同一页面中同时加载这三者，并不会发生冲突，但这样对网页性能并没有好处。优化建议如下：

* 如果你的 DApp 依赖 neb.js 只是因为你需要向合约查询数据，则建议把相关代码迁移到 Nasa.js。这样你的 DApp 就不需要加载 neb.js 了。

* 由于 Nasa.js 本身已经打包了 nebPay 的源码，因此你不需要重复加载 nebPay。使用 `Nasa.nebPay` 即可以取代你代码中的 `nebPay` 实例，详情参见 ~~此文档~~。

#### 我需要的某个功能 Nasa.js 还不支持，怎么办？

来给 Nasa.js [提 issue](https://github.com/cssmagic/Nasa.js/issues/new) 吧！

***

## License

[LGPL-3.0](https://opensource.org/licenses/lgpl-3.0.html)

