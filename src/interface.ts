import Decimal from 'decimal.js'

export interface IDriver {
  timeout: number

  /**
   * Send a notify message to target window
   *
   * @param {string} [channel]
   * @param {string} method
   * @param {any} [params]
   */
  notify (
    { channel, method, params }:
    { channel?: string, method: string, params?: any }
  ): void

  /**
   * Send a request message to target window
   *
   * Return a promise which will be resolve or reject if target window send response.
   *
   * @param {string} [channel]
   * @param {string} method
   * @param {any} [params]
   * @return {Promise<T>}
   */
  request<T> (
    { channel, method, params }:
    { channel?: string, method: string, params?: any }
  ): Promise<T>

  /**
   * Send a response message to target window
   *
   * @param {string} [channel]
   * @param {string} id
   * @param {any} [result]
   * @param {any} [error]
   */
  response (
    { channel, id, result, error }:
    { channel?: string, id: string, result?: any, error?: any }
  ): void
}

export interface IResponseTask {
  createdAt: Date,
  message: IRequestMessage,
  source: Window,
}

export interface IRequestTask {
  createdAt: Date,
  message: IRequestMessage,
  reject: Function,
  resolve: Function,
}

export interface IRequestMessage {
  channel: string,
  id: string,
  method: string,
  params: any,
}

export interface INotifyMessage {
  channel: string,
  method: string,
  params: any,
}

export interface IResponseMessage {
  channel: string,
  error?: IError,
  id: string,
  result?: any,
}

export interface IError {
  code: number,
  data: any | null,
  message: string,
}

export interface ISignInResult {
  address:  string,
  nickname: string,
  profile:  any,
}

export interface ISignedTransactionResult {
  signedTransaction: RPC.RawTransaction,
}

export interface IUTXOToParam {
  address: string,
  value: Decimal.Value,
}

export interface IUTXOUnspent {
  txId: string,
  address: string,
  vout: number,
  value: Decimal.Value,
  lock?: any,
  lockHash?: string,
}
