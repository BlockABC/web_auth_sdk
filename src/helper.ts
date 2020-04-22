import { IError, INotifyMessage, IRequestMessage, IResponseMessage } from './interface'

export function isNumber (val: any): val is number {
  return typeof val === 'number'
}

export function isString (val: any): val is string {
  return typeof val === 'string'
}

export function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj
}

export function isRequestMessage (val: any): val is IRequestMessage {
  return !!(val.channel && val.id && val.method && val.hasOwnProperty('params'))
}

export function isNotifyMessage (val: any): val is INotifyMessage {
  return !!(val.channel && val.method && val.hasOwnProperty('params') && !val.hasOwnProperty('id'))
}

export function isResponseMessage (val: any): val is IResponseMessage {
  let ret = false
  if (val.hasOwnProperty('result')) {
    ret = true
  }
  else if (val.hasOwnProperty('error') && isError(val.error)) {
    ret = true
  }

  return !!(val.channel && val.id && ret)
}

export function isError (val: any): val is IError {
  return !!(val.code && val.hasOwnProperty('message') && val.hasOwnProperty('data'))
}

export function isMessage (val: any): boolean {
  return isNotifyMessage(val) || isRequestMessage(val) || isResponseMessage(val)
}

export function isWindow (val: any): boolean {
  return val && val.hasOwnProperty('postMessage')
}

export function isValidUrl (val: any): boolean {
  try {
    new URL(val)
    return true
  }
  catch {
    return false
  }
}
