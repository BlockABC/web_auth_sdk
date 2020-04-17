import { IError, INotifyMessage, IRequestMessage, IResponseMessage } from './interface'

export function isRequestMessage (val: any): val is IRequestMessage {
  return !!(val.channel && val.id && val.method && val.hasOwnProperty('params'))
}

export function isNotifyMessage (val: any): val is INotifyMessage {
  return !!(val.channel && val.method && val.hasOwnProperty('params'))
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
