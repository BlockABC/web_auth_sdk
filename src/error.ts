import { CustomError } from 'ts-custom-error'

export class WebAuthError extends CustomError {
  protected static messages = {
    1: 'Unkown error',
  }

  public code: number

  constructor (code: number, message: string) {
    super(message)

    this.code = code
  }

  public static fromCode (code: number, extendMessage = ''): WebAuthError {
    return new WebAuthError(code, WebAuthError.messages[code] + extendMessage)
  }
}

export class ParamError extends CustomError {
  protected static messages = {
    100: 'is invalid window object.',
    101: 'is invalid url.',
  }

  public name = 'ParamError'
  public code: number

  constructor (code: number, message) {
    super(message)
    this.code = code
  }

  public static fromCode (code: number, paramName: string): ParamError {
    return new ParamError(code, `Param[${paramName}] ${ParamError.messages[code]}`)
  }
}
