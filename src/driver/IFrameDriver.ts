import consola, { Consola } from 'consola'
import EventEmitter from 'eventemitter3'

import { IDriver, INotifyMessage, IRequestMessage, IResponseMessage, IRequestTask, IResponseTask } from '../interface'
import { ParamError, WebAuthError } from '../error'
import { isMessage, isNotifyMessage, isRequestMessage, isResponseMessage, isValidUrl, isWindow } from '../helper'

export class IFrameDriver extends EventEmitter implements IDriver {
  protected _defaultChannel: string
  // ID of request messages
  protected _id: number
  protected _log: Consola
  // received requests need response
  protected _needToResponse: Map<string, IResponseTask>
  protected _targetOrigin: string
  // Tasks need to be cleaned up on a regular basis.
  // sent out requests wait for response
  protected _waitForResponse: Map<string, IRequestTask>
  // iframe.contentWindow
  protected _win: Window
  // Timer ID of timeout task cleaner
  protected _cleanTimerId: any
  // Timeout limit for tasks' waiting for a response
  protected _timeout: number

  set timeout (val: number) {
    this._timeout = val
  }

  get timeout () {
    return this._timeout
  }

  constructor (
    { win, defaultChannel = 'default', targetOrigin, timeout = 300000 }:
    { win: Window, defaultChannel?: string, targetOrigin: string, timeout?: number }
  ) {
    super()

    if (!isWindow(win)) {
      throw ParamError.fromCode(100, 'win')
    }

    if (!isValidUrl(targetOrigin)) {
      throw ParamError.fromCode(101, 'targetOrigin')
    }

    this._win = win
    this._defaultChannel = defaultChannel
    this._targetOrigin = this._cleanOrigin(targetOrigin)
    this._timeout = timeout

    this._id = 1
    this._needToResponse = new Map()
    this._waitForResponse = new Map()
    this._log = consola.withTag('IframeDriver')

    window.addEventListener('message', this._listen.bind(this))

    this._cleanTimerId = setInterval(this._cleanTimeoutTask.bind(this), 5000)
  }

  notify (
    { channel, method, params = null }:
    { channel?: string, method: string, params?: any }
  ) {
    channel = channel ?? this._defaultChannel

    const message: INotifyMessage = {
      channel,
      method,
      params,
    }

    this._log.info(`Notify ${this._targetOrigin}.`)
    this._log.debug(`Notify content:`, message)
    this._win.postMessage(message, this._targetOrigin)
  }

  request<T>(
    { channel, method, params = null }:
    { channel?: string; method: string; params?: any }
  ): Promise<T> {
    channel = channel ?? this._defaultChannel

    const id = this._id++
    const key = `${channel}-${id}`
    const message: IRequestMessage = {
      channel,
      id: '' + id,
      method,
      params,
    }

    const promise = new Promise<any>((resolve, reject) => {
      this._waitForResponse.set(key, {
        createdAt: new Date(),
        resolve,
        reject,
        message,
      })
    })

    this._log.info(`Request ${this._targetOrigin}.`)
    this._log.debug(`Request content:`, message)
    this._win.postMessage(message, this._targetOrigin)
    return promise
  }

  response (
    { channel, id, result = null, error = null }:
    { channel?: string, id: string, result?: any, error?: any }
  ): void {
    channel = channel ?? this._defaultChannel

    const key = `${channel}-${id}`
    const task = this._needToResponse.get(key)

    if (!task) {
      this._log.warn(`Can not find request [${key}], skip response.`)
      return
    }

    let message: IResponseMessage
    if (result) {
      message = { channel, id, result }
    }
    else if (error) {
      message = { channel, id, error }
    }
    else {
      throw new Error(`Response must contain result or error, but both is nil.`)
    }

    this._log.info(`Response ${this._targetOrigin}.`)
    this._log.debug(`Response content:`, message)
    task.source.postMessage(message, this._targetOrigin)
    this._needToResponse.delete(key)
  }

  /**
   * Format and unify origin
   *
   * @param {string} origin
   * @returns {string}
   */
  protected _cleanOrigin (origin: string) {
    let url
    try {
      url = new URL(origin)
    }
    catch (err) {
      return ''
    }

    if (url.hostname === 'localhost') {
      url.hostname = '127.0.0.1'
    }

    return url.toString().slice(0, -1)
  }

  /**
   * Clean up timeout tasks in a regular basis
   */
  protected _cleanTimeoutTask () {
    this._log.trace(`Start cleaning timeout request`)
    const now = new Date()
    for (let [key, val] of this._waitForResponse.entries()) {
      if (now.getTime() - val.createdAt.getTime() > this._timeout) {
        this._waitForResponse.delete(key)

        this._log.warn(`Delete timeout task ${key}`)
        this._log.debug(`Delete timeout task ${key}`, val.message)
      }
    }
  }

  /**
   * Handle message sent to current window
   *
   * @param {Event} e
   */
  protected _listen (e: MessageEvent): void {
    // Skip message created by vue-devtools
    if (e.data.source && typeof e.data.source === 'string' && e.data.source.startsWith('vue-devtools')) {
      return
    }

    this._log.info(`Received message from: ${e.origin}`)
    this._log.debug(`Message content:`, e.data)

    // skip empty message
    if (!isMessage(e.data)) {
      this._log.warn(`Skip message because its structure is invalid.`)
      return
    }
    // skip message from invalid page
    else if (this._targetOrigin !== this._cleanOrigin(e.origin)) {
      this._log.warn(`Skip message because its origin is invalid.`)
      return
    }

    const message = e.data
    const event = `${message.channel}:*`
    if (isNotifyMessage(message)) {
      this.emit(event, message)
    }
    else if (isRequestMessage(message)) {
      this._needToResponse.set(`${message.channel}-${message.id}`, {
        createdAt: new Date(),
        source: (e.source as Window),
        message,
      })

      this.emit(event, message)
    }
    else if (isResponseMessage(message)) {
      const key = `${message.channel}-${message.id}`
      const task = this._waitForResponse.get(key)
      if (!task) {
        this._log.warn(`Skip message because task can not be found.`)
        return
      }

      if (message.result) {
        this._log.debug(`Resolve task: ${key}`)
        task.resolve(message.result)
      }
      else if (message.error) {
        this._log.debug(`Reject task: ${key}`)
        task.reject(new WebAuthError(message.error.code, message.error.message))
      }
      else {
        this._log.error(`Skip message because no result and error.`)
      }
    }
    else {
      this._log.warn(`Skip message because origin is invalid.`)
    }
  }
}
