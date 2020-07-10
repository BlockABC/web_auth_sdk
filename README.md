# Web Auth SDK

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

[README](README.md) | [中文文档](README.zh.md)


## Introduction

The Web Auth SDK is part of the Web Auth framework and is available to Dapp who wish to access Web Auth services. First, Dapp needs to embed [Web Auth Page] through iframe, and then it can communicate with [Web Auth Page] via the SDK.


## Getting started

### Installation

```shell
npm install @blockabc/web_auth_sdk
```

### Example

The source code is located at [example/static/main.js](. /example/static/main.js), `clone` this project, install the dependencies, and then run `npm run dev` to see the demo Dapp.
If you need to customize the environment variables such as HOST, PORT, etc., you can create a new `.env` file which will override the environment variables in `.development.env`.
Note that **you must configure the `iframeSrc` constant at the top of [example/static/main.js](./example/static/main.js) base on the URL of your [Web Auth Page] server.

#### Initialization

```typescript
const webauth = new WebAuth({
  options: {
    win: iframe.contentWindow,
    targetOrigin: 'http://127.0.0.1:3000', // must be the url of web_auth_page
  }
})
```

#### Request user to sign in and get CKB address

```typescript
try {
  const { address, nickname, profile } = await webauth.signIn()
}
catch (err) {
  // If the user declines, then an error will be thrown
  alert(err.message)
}
```

#### Request user to build transaction

```typescript
try {
  const { signedTransaction } = await webauth.buildTransaction(tos)
}
catch (err) {
  // If the user declines, then an error will be thrown
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

The structure of the `options` depends on which drivier you choose, the driver is abstract communication layer of the SDK, which may support environments like Android and iOS webview by implementing different drivers.

### webauth.ping

```typescript
webauth.ping (): Promise<string>
```

Check if connection between the SDK and [Web Auth Page] has been established, and return the string `pong` when it is true.

### webauth.signIn

```typescript
interface ISignInResult {
  address:  string;
  nickname: string;
  profile:  any;
}

webauth.signIn ({ readyForSign }: { readyForSign?: boolean } = {}): Promise<ISignInResult>
```

The user is requested to sign in, and a successful signing in will return a instance of `ISignInResult`.

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

Request user to build transaction.

> Go here for [RPC.RawTransaction]

### webauth.signTransaction

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

Request user to sign transaction。Constructing unsigned transactions and obtaining `IUTXOUnspent[]` requires the use of [One Chain CKB](https://github.com/BlockABC/one_chain_ckb), which you can learn about in this [example](https://github.com/BlockABC/one_chain_ckb/blob/d5d441528d40c3769d087572e569abb3e0ab0784/example/node/ckb_create_unsigned_transaction.js#L18-L39).

> Go here for [RPC.RawTransaction]

### webauth.pushTransaction

```typescript
webauth.pushTransaction ({ rawTransaction }: { rawTransaction: RPC.RawTransaction }): Promise<{ txId: string }>
```

Push transactions through the RPC node of [Web Auth Page], will not disturb user.

> Go here for [RPC.RawTransaction]


## Development

This is a simple SDK, but we still welcome anyone to contribute a piece of code after familiar with the source code quickly, whether it's adding an interface, implementing a Driver, or perfecting documentation.

### Code Style

We use a little tweaked version of standardjs: https://github.com/BlockABC/eslint-config-blockabc


## Issues

Please feel free to submit your questions at [Issues](https://github.com/BlockABC/web_auth_sdk/issues).


## License

[MIT](LICENSE)


[Web Auth Page]: https://github.com/BlockABC/web_auth_page/
[RPC.RawTransaction]: https://github.com/nervosnetwork/ckb-sdk-js/blob/34d62bb9c86b680e5887194131379c2a01b4f068/packages/ckb-sdk-rpc/types/rpc/index.d.ts#L83-L91

