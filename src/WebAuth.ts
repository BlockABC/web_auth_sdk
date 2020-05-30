import consola, { Consola } from 'consola'
import EventEmitter from 'eventemitter3'

import { ParamError } from './error'
import { hasKey, isString } from './helper'

import { IDriver, ISignedTransactionResult, ISignInResult, IUTXOToParam, IUTXOUnspent } from './interface'
import { LOG_LEVEL } from './constants'
import { IFrameDriver } from './driver'

export class WebAuth extends EventEmitter {
  protected _driver: IDriver
  protected _log: Consola

  get driver (): IDriver {
    return this._driver
  }

  constructor (
    { driver = 'iframe', options, loglevel = 'info' }:
    { driver?: string, options: any, loglevel?: string | number }
  ) {
    super()

    if (hasKey(LOG_LEVEL, loglevel)) {
      consola.level = LOG_LEVEL[loglevel]
    }
    else if (!isString(loglevel)) {
      consola.level = loglevel
    }
    this._log = consola.withTag('WebAuth')

    if (driver === 'webview') {
      // TODO implement webview postMessage support
      throw ParamError.fromCode(999, 'driver')
    }
    else {
      this._driver = new IFrameDriver({ ...options })
    }
  }

  /**
   * Send ping request
   *
   * @returns {Promise<string>}
   */
  ping (): Promise<string> {
    return this._driver.request<string>({ method: 'ping' })
  }

  /**
   * Send sign in request
   *
   * @param {boolean} [readyForSign] default false, whether the user is required to prepare a signature
   * @returns {Promise<ISignInResult>}
   */
  signIn ({ readyForSign }: { readyForSign?: boolean } = {}): Promise<ISignInResult> {
    return this._driver.request<any>({
      method: 'signIn',
      params: { readyForSign },
    })
  }

  /**
   * Send request for building transaction
   *
   * @param {IUTXOToParam[]} tos
   * @returns {Promise<ISignedTransactionResult>}
   */
  buildTransaction ({ tos }: { tos: IUTXOToParam[] }): Promise<ISignedTransactionResult> {
    return this._driver.request<any>({
      method: 'buildTransaction',
      params: { tos },
    })
  }

  /**
   * Send request for signing transaction
   *
   * @param {IUTXOUnspent[]} unspents
   * @param {RPC.RawTransaction} rawTransaction
   * @returns {Promise<ISignedTransactionResult>}
   */
  signTransaction (
    { unspents, rawTransaction }:
    { unspents: IUTXOUnspent[], rawTransaction: RPC.RawTransaction }
  ): Promise<ISignedTransactionResult> {
    return this._driver.request<any>({
      method: 'signTransaction',
      params: { unspents, rawTransaction }
    })
  }

  /**
   * Push raw transaction
   *
   * @param {RPC.RawTransaction} rawTransaction
   * @return {Promise<{ txId: string }>}
   */
  pushTransaction ({ rawTransaction }: { rawTransaction: RPC.RawTransaction }): Promise<{ txId: string }> {
    return this._driver.request<any>({ method: 'pushTransaction', params: { rawTransaction } })
  }
}
