import consola, { Consola } from 'consola'

import { ParamError } from './error'
import { hasKey, isString } from './helper'

import { IDriver } from './interface'
import { LOG_LEVEL } from './constants'
import { IFrameDriver } from './driver'

export class WebAuth {
  protected _driver: IDriver
  protected _log: Consola

  get driver (): IDriver {
    return this._driver
  }

  constructor(
    { driver, options, loglevel = 'info' }:
    { driver: string, options: any, loglevel?: string | number }
  ) {
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
   * @returns {Promise<boolean>}
   */
  ping (): Promise<boolean> {
    return this._driver.request<boolean>({ method: 'ping' })
  }

  /**
   * Send sign in request
   *
   * @param {boolean} [readyForSign] default false, whether the user is required to prepare a signature
   * @returns {Promise<any>}
   */
  signIn ({ readyForSign = false }: { readyForSign?: boolean } = {}): Promise<any> {
    return this._driver.request<any>({
      method: 'signIn',
      params: {
        readyForSign,
      }
    })
  }

  buildTransaction (): Promise<any> {
    return this._driver.request<any>({ method: 'buildTransaction', params: { } })
  }

  signTransaction ({ rawTransaction }: { rawTransaction: any }): Promise<any> {
    return this._driver.request<any>({ method: 'signTransaction', params: { rawTransaction } })
  }

  pushTransaction ({ rawTransaction }: { rawTransaction: any }): Promise<any> {
    return this._driver.request<any>({ method: 'signTransaction', params: { rawTransaction } })
  }
}