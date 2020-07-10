# Web Auth SDK

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

[README](README.md) | [中文文档](README.zh.md)


## Introduction

Web Auth SDK 是 Web Auth 框架的一部分，提供给希望接入 Web Auth 服务的 Dapp 使用。首先 Dapp 需要以 iframe 的形式嵌入 [Web Auth Page]，然后就可以通过 SDK 与 [Web Auth Page] 进行通信。


## Getting started

### 安装

```shell
npm install @blockabc/web_auth_sdk
```

### 示例

源码位于 [example/static/main.js](./example/static/main.js) ，`clone` 本项目，安装相关依赖，然后执行 `npm run dev` 即可看到示例用的 Dapp 。
如果需要自定义 HOST、PORT 等环境变量，可以新建一个 `.env` 文件，其中的环境变量配置会覆盖 `.development.env` 中的环境变量配置。
需要注意的是**你必须根据你的 [Web Auth Page] 所在 URL 配置 [example/static/main.js](./example/static/main.js) 顶部的 `iframeSrc` 变量**。

#### 初始化

```typescript
const webauth = new WebAuth({
  options: {
    win: iframe.contentWindow,
    targetOrigin: 'http://127.0.0.1:3000', // 必须是 web_auth_page 的 url
  }
})
```

#### 请求用户登陆并获得地址

```typescript
try {
  const { address, nickname, profile } = await webauth.signIn()
}
catch (err: WebAuthError) {
  // 如果用户拒绝，那么就会抛出错误
  alert(err.message)
}
```

#### 请求用户创建交易

```typescript
try {
  const { signedTransaction } = await webauth.buildTransaction(tos)
}
catch (err: WebAuthError) {
  // 如果用户拒绝，那么就会抛出错误
  alert(err.message)
}
```


## API

### class WebAuth

```typescript
class WebAuth {
  constructor (
    { driver = 'iframe', options, loglevel = 'info' }:
    { driver?: string, options: any, loglevel?: string | number }
  ): void;
}
```

`options` 的具体结构取决于你才用哪个 drivier ，driver 是 SDK 的通信抽象层，可以通过实现不同的 driver 来支持 Android 以及 iOS 的 webview 等不同环境。

### webauth.ping

```typescript
webauth.ping (): Promise<string>
```

检查 SDK 和 [Web Auth Page] 之间是否已经能够成功通信，成功后返回字符串 `pong`。

### webauth.signIn

```typescript
interface ISignInResult {
  address:  string;
  nickname: string;
  profile:  any;
}

webauth.signIn ({ readyForSign }: { readyForSign?: boolean } = {}): Promise<ISignInResult>
```

请求用户登陆，登陆成功后会返回 `ISignInResult` 实例。

### webauth.buildTransaction

```typescript
interface IUTXOToParam {
  address: string,
  value: Decimal.Value,
}

interface ISignedTransactionResult {
  signedTransaction: RPC.RawTransaction,
}

webauth.buildTransaction ({ tos }: { tos: IUTXOToParam[] }): Promise<ISignedTransactionResult>
```

请求用户创建交易。

> 这里查看 [RPC.RawTransaction]

### webauth.buildTransaction

```typescript
interface IUTXOUnspent {
  txId: string,
  address: string,
  vout: number,
  value: Decimal.Value,
  lock?: any,
  lockHash?: string,
}

webauth.signTransaction ( { unspents, rawTransaction }: { unspents: IUTXOUnspent[], rawTransaction: RPC.RawTransaction } ): Promise<ISignedTransactionResult>
```

请求用户签名交易。构建未签名交易以及获得 `IUTXOUnspent[]` 需要用到 [One Chain CKB](https://github.com/BlockABC/one_chain_ckb)，这个[示例](https://github.com/BlockABC/one_chain_ckb/blob/d5d441528d40c3769d087572e569abb3e0ab0784/example/node/ckb_create_unsigned_transaction.js#L18-L39)里你可以了解到具体的代码。

> 这里查看 [RPC.RawTransaction]

### webauth.buildTransaction

```typescript
webauth.pushTransaction ({ rawTransaction }: { rawTransaction: RPC.RawTransaction }): Promise<{ txId: string }>
```

通过 [Web Auth Page] 的 RPC 节点推送交易，无需经过用户同意。

> 这里查看 [RPC.RawTransaction]


## Development

这是一个简单的 SDK ，但是我们仍然十分欢迎任何人在快速熟悉源码后来贡献自己的一份代码，无论是添加接口、实现 Driver 、还是完善文档。

###

### 代码风格

我们采用一个稍微修改过的 standardjs 标准: https://github.com/BlockABC/eslint-config-blockabc


## Issues

请随意地前往 [Issues](https://github.com/BlockABC/web_auth_sdk/issues) 提出你的问题。


## License

[MIT](LICENSE)


[Web Auth Page]: https://github.com/BlockABC/web_auth_page/
[RPC.RawTransaction]: https://github.com/nervosnetwork/ckb-sdk-js/blob/34d62bb9c86b680e5887194131379c2a01b4f068/packages/ckb-sdk-rpc/types/rpc/index.d.ts#L83-L91
