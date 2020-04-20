import * as helper from '~/helper'

describe('helper', () => {
  describe('isNumber', () => {
    test('should works', () => {
      expect(helper.isNumber('')).toBeFalsy()
      expect(helper.isNumber(0)).toBeTruthy()
      expect(helper.isNumber(true)).toBeFalsy()
      expect(helper.isNumber(null)).toBeFalsy()
      expect(helper.isNumber({})).toBeFalsy()
      expect(helper.isNumber([])).toBeFalsy()
    })
  })

  describe('isString', () => {
    test('should works', () => {
      expect(helper.isString('')).toBeTruthy()
      expect(helper.isString(0)).toBeFalsy()
      expect(helper.isString(true)).toBeFalsy()
      expect(helper.isString(null)).toBeFalsy()
      expect(helper.isString({})).toBeFalsy()
      expect(helper.isString([])).toBeFalsy()
    })
  })

  describe('hasKey', () => {
    test('should works', () => {
      const val = {
        test: 1,
      }

      expect(helper.hasKey(val, 'test')).toBeTruthy()
      expect(helper.hasKey(val, 'xxxx')).toBeFalsy()
    })
  })

  describe('isRequestMessage', () => {
    test('should return true if it implement IRequestMessage', () => {
      const message = {
        channel: 'default',
        id: '1',
        method: 'test',
        params: {
          a: 1,
          b: '2',
        }
      }
      expect(helper.isRequestMessage(message)).toBeTruthy()
    })

    test('should support nil params', () => {
      const message = {
        channel: 'default',
        id: '1',
        method: 'test',
        params: null as any
      }
      expect(helper.isRequestMessage(message)).toBeTruthy()
    })

    test('should return false if it does not implement IRequestMessage', () => {
      const message = {
        channel: 'default',
        id: '1',
        method: 'test',
      }
      expect(helper.isRequestMessage(message)).toBeFalsy()
    })
  })

  describe('isNotifyMessage', () => {
    test('should return true if it implement INotifyMessage', () => {
      const message = {
        channel: 'default',
        method: 'test',
        params: {
          a: 1,
          b: '2',
        }
      }
      expect(helper.isNotifyMessage(message)).toBeTruthy()
    })

    test('should support nil params', () => {
      const message = {
        channel: 'default',
        method: 'test',
        params: null as any
      }
      expect(helper.isNotifyMessage(message)).toBeTruthy()
    })

    test('should return false if it does not implement INotifyMessage', () => {
      const message = {
        channel: 'default',
        method: 'test',
      }
      expect(helper.isNotifyMessage(message)).toBeFalsy()
    })
  })

  describe('isResponseMessage', () => {
    test('should return true if it implement IResponseMessage', () => {
      const message1 = {
        channel: 'default',
        id: '1',
        result: {
          a: 1,
          b: '2',
        }
      }
      expect(helper.isResponseMessage(message1)).toBeTruthy()

      const message2 = {
        channel: 'default',
        id: '1',
        error: {
          code: 123,
          message: '',
          data: null as any
        }
      }
      expect(helper.isResponseMessage(message2)).toBeTruthy()
    })

    test('should support nil result', () => {
      const message = {
        channel: 'default',
        id: '1',
        result: null as any
      }
      expect(helper.isResponseMessage(message)).toBeTruthy()
    })

    test('should return false if it does not implement IResponseMessage', () => {
      const message = {
        channel: 'default',
        id: '1',
      }
      expect(helper.isRequestMessage(message)).toBeFalsy()
    })
  })

  describe('isError', () => {
    test('should return true if it implement IError', () => {
      const error = {
        code: 123,
        message: 'xxxx',
        data: null as any
      }
      expect(helper.isError(error)).toBeTruthy()
    })

    test('should support empty message', () => {
      const error = {
        code: 123,
        message: '',
        data: null as any
      }
      expect(helper.isError(error)).toBeTruthy()
    })

    test('should return false if it does not implement IError', () => {
      const error = {
        code: 123,
        message: '',
      }
      expect(helper.isError(error)).toBeFalsy()
    })
  })

  describe('isMessage', () => {
    test('should return true if it is message', () => {
      const message1 = {
        channel: 'default',
        id: '1',
        method: 'test',
        params: null as any
      }
      expect(helper.isMessage(message1)).toBeTruthy()

      const message2 = {
        channel: 'default',
        method: 'test',
        params: null as any
      }
      expect(helper.isMessage(message2)).toBeTruthy()

      const message3 = {
        channel: 'default',
        id: '1',
        result: {
          a: 1,
          b: '2',
        }
      }
      expect(helper.isMessage(message3)).toBeTruthy()
    })

    test('should return false if it is not message', () => {
      const error = {
        code: 123,
        message: '',
      }
      expect(helper.isMessage(error)).toBeFalsy()
    })
  })

  describe('isWindow', () => {
    test('should return true if it has portMessage', () => {
      expect(helper.isWindow(window)).toBeTruthy()
    })

    test('should return false if it has not portMessage', () => {
      expect(helper.isWindow({})).toBeFalsy()
    })
  })

  describe('isValidUrl', () => {
    test('should return true if url is valid', () => {
      const url = 'http://127.0.0.1:3000'
      expect(helper.isValidUrl(url)).toBeTruthy()
    })

    test('should return false if url is valid', () => {
      const url = ''
      expect(helper.isValidUrl(url)).toBeFalsy()
    })
  })
})
