import { CustomError } from 'ts-custom-error'
import { hasKey } from './helper'

export class WebAuthError extends CustomError {
  protected static messages = {
    1: 'Unkown error',
  }

  public code: number

  constructor (code: number, message: string) {
    super(message)

    this.code = code
  }

  public static fromCode (code: number): WebAuthError {
    const message = hasKey(WebAuthError.messages, code) ? WebAuthError.messages[code] : 'Undefined error code'
    return new WebAuthError(code, message)
  }
}

export class ParamError extends CustomError {
  protected static messages = {
    100: 'is invalid window object.',
    101: 'is invalid url.',
    999: 'is still not implemented.'
  }

  public name = 'ParamError'
  public code: number

  constructor (code: number, message: string) {
    super(message)
    this.code = code
  }

  public static fromCode (code: number, paramName: string): ParamError {
    const message = hasKey(ParamError.messages, code) ? ParamError.messages[code] : 'Undefined error code'
    return new ParamError(code, `Param[${paramName}] ${message}`)
  }
}
