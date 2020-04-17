export interface IDriver {
  request (params: { channel?: string, method: string, params?: any }): void
  response (params: { channel?: string, id: string, result?: any, error?: any }): void
  notify (params: { channel?: string, method: string, params?: any }): void
}

export interface IResponseTask {
  createdAt: Date,
  source: Window,
  message: IRequestMessage,
}

export interface IRequestTask {
  createdAt: Date,
  resolve: Function,
  reject: Function,
  message: IRequestMessage,
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
  id: string,
  result?: any,
  error?: IError
}

export interface IError {
  code: number,
  message: string,
  data: any | null
}
