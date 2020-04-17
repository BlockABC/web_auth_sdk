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
