import consola from 'consola'

import { IFrameDriver } from '~/driver'
import { INotifyMessage, IRequestMessage } from '~/interface'
import { currentOrigin, targetOrigin } from '../const'

consola.clear()

// @ts-ignore
// consola.level = 'debug'

let driver: IFrameDriver

beforeAll(() => {
  delete window.location
  window.location = <Location>{origin: currentOrigin}

  driver = new IFrameDriver({
    win: window,
    targetOrigin: targetOrigin
  })
})

function mockPostMessage (driver: IFrameDriver) {
  Reflect.set(driver, '_id', 1)

  delete window.postMessage
  window.postMessage = jest.fn()
}

describe('IframeDriver', () => {
  describe('notify', () => {
    test('should send notify', () => {
      mockPostMessage(driver)

      const message = {
        method: 'test',
        params: {
          a: 1,
          b: 2,
        }
      }
      driver.notify(message)

      const expectedMessage = Object.assign({
        channel: 'default'
      }, message)
      expect(window.postMessage).toBeCalledWith(expectedMessage, targetOrigin)
    })
  })


  describe('request', () => {
    test('should send request', () => {
      mockPostMessage(driver)

      const message = {
        method: 'test',
        params: {
          a: 1,
          b: 2,
        }
      }
      driver.request(message)

      const expectedMessage = Object.assign({
        channel: 'default',
        id: '1',
      }, message)
      expect(window.postMessage).toBeCalledWith(expectedMessage, targetOrigin)
    })
  })

  describe('response', () => {
    test('should support send result as response', () => {
      mockPostMessage(driver)

      // Create a task need response
      const channel = 'default'
      const id = '1'
      const needToResponse = Reflect.get(driver, '_needToResponse')
      needToResponse.set(`${channel}-${id}`, {
        createdAt: new Date(),
        source: window,
        message: null,
      })

      const result = {
        a: 1,
        b: '2',
      }
      driver.response({ id: '1', result })

      const expectedMessage = {
        channel: 'default',
        id: '1',
        result,
      }
      expect(window.postMessage).toBeCalledWith(expectedMessage, targetOrigin)
    })
  })

  describe('_cleanTimeoutTask', () => {
    test('should clean out timeout tasks', (done) => {
      driver.timeout = 100
      driver.request({ method: 'test1', params: null })
      driver.request({ method: 'test2', params: null })
      driver.request({ method: 'test3', params: null })

      const tasks = Reflect.get(driver, '_waitForResponse')
      setTimeout(() => {
        expect(tasks.size).toBe(0)
        done()
      }, 5000)
    }, 10000)
  })

  describe('_listen', () => {
    test('should emit event if received notify', (done) => {
      const channel = 'default'
      const method = 'notify1'
      const message = {
        channel,
        method,
        params: {
          a: 1,
          b: '2',
        }
      }
      const e = {
        origin: targetOrigin,
        source: window,
        data: message,
      }

      driver.on(`${channel}:${method}`, (m: INotifyMessage) => {
        expect(m).toEqual(message)
        done()
      })

      const _listen = Reflect.get(driver, '_listen')
      Reflect.apply(_listen, driver, [e])
    })

    test('should emit event if received request', (done) => {
      const channel = 'default'
      const method = 'request1'
      const message = {
        channel,
        id: '1',
        method,
        params: {
          a: 1,
          b: '2',
        }
      }
      const e = {
        origin: targetOrigin,
        source: window,
        data: message,
      }

      driver.on(`${channel}:${method}`, (m: IRequestMessage) => {
        expect(m).toEqual(message)
        done()
      })

      const _listen = Reflect.get(driver, '_listen')
      Reflect.apply(_listen, driver, [e])
    })

    test('should resolve task if received result', (done) => {
      Reflect.set(driver, '_id', 2)
      const res = driver.request({ method: 'test1', params: null })

      const result = {
        a: 1,
        b: '2',
      }
      const message = {
        channel: 'default',
        id: '2',
        result,
      }
      const e = {
        origin: targetOrigin,
        source: window,
        data: message,
      }

      res.then((val) => {
        expect(val).toEqual(result)
        done()
      })

      const _listen = Reflect.get(driver, '_listen')
      Reflect.apply(_listen, driver, [e])
    })

    test('should reject task if received error', (done) => {
      Reflect.set(driver, '_id', 3)
      const res = driver.request({ method: 'test1', params: null })

      const error = {
        code: 1,
        message: '',
        data: null as any,
      }
      const message = {
        channel: 'default',
        id: '3',
        error,
      }
      const e = {
        origin: targetOrigin,
        source: window,
        data: message,
      }

      res.catch((err) => {
        expect(err).toEqual(error)
        done()
      })

      const _listen = Reflect.get(driver, '_listen')
      Reflect.apply(_listen, driver, [e])
    })
  })
})
