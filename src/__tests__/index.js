import Snuffles from '../index.js'
global.fetch = require('jest-fetch-mock')

const baseUrl = 'http://example.com'
const requestPath = '/users'
const requestUrl = baseUrl + requestPath
const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}
const defaultResponseHeaders = {
  'Content-Type': 'application/json',
  'Content-Length': 100
}

describe('snuffles', () => {
  beforeEach(() => {
    global.fetch.resetMocks()
  })

  describe('initialization', () => {
    it('is not valid without a basUrl', () => {
      expect(() => new Snuffles()).toThrow()
    })

    it('is valid without defaultRequestOptions', () => {
      const api = new Snuffles(baseUrl)
      expect(api).toBeTruthy()
    })

    it('sets the baseUrl and default options', () => {
      const defaultRequestOptions = {
        headers: {
          'X-AUTH-TOKEN': 'secret',
          ...defaultHeaders
        }
      }

      const api = new Snuffles(baseUrl, defaultRequestOptions)
      expect(api.baseUrl).toEqual(baseUrl)
      expect(api.defaultRequestOptions).toEqual(defaultRequestOptions)
    })

    it('sets the default body formatting', () => {
      const api = new Snuffles(baseUrl)
      expect(api.metaOptions.bodyKeyCase).toEqual('SNAKE_CASE')
    })

    it('sets the passed body formatting', () => {
      const metaOptions = { bodyKeyCase: 'CAMEL_CASE' }
      const api = new Snuffles(baseUrl, {}, metaOptions)
      expect(api.metaOptions.bodyKeyCase).toEqual('CAMEL_CASE')
    })

    it('does not set a forbidden body formatting', () => {
      const metaOptions = { bodyKeyCase: 'SOME_CASE' }
      expect(() => new Snuffles(baseUrl, {}, metaOptions)).toThrow()
    })
  })

  describe('request', () => {
    describe('without default options', () => {
      let api

      beforeEach(() => {
        api = new Snuffles(baseUrl)
      })

      it('throws an error if no valid method is set in options', () => {
        global.fetch.mockResponseOnce(JSON.stringify({}))

        expect(() => api.request(requestPath)).toThrow()
      })
    })

    describe('with defaults', () => {
      let api
      beforeEach(() => {
        api = new Snuffles(baseUrl, {
          method: 'GET',
          headers: { 'X-AUTH-TOKEN': 'token' }
        })
      })

      it('makes a request to the given url', () => {
        global.fetch.mockResponseOnce(JSON.stringify({}))
        api.request(requestPath)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(requestUrl, expect.anything())
      })

      it('merges the passed options with the defaultRequestOptions', () => {
        const options = {
          headers: {
            'X-ALLOW-FRAME': 'SAMEORIGIN',
            Accept: 'application/pdf'
          }
        }

        const mergedOptions = {
          method: 'GET',
          headers: {
            ...defaultHeaders,
            'X-ALLOW-FRAME': 'SAMEORIGIN',
            'X-AUTH-TOKEN': 'token',
            Accept: 'application/pdf'
          }
        }

        global.fetch.mockResponseOnce(JSON.stringify({}), {
          status: 200,
          headers: defaultResponseHeaders
        })
        api.request(requestPath, options)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(
          requestUrl,
          expect.objectContaining(mergedOptions)
        )
      })

      it('merges the passed url with the baseUrl', () => {
        global.fetch.mockResponseOnce(JSON.stringify({}), {
          status: 200,
          headers: defaultResponseHeaders
        })
        api.request(requestPath)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(requestUrl, expect.anything())
      })

      it('throws an error if the status code was not 200', () => {
        global.fetch.mockResponseOnce(JSON.stringify({}), { status: 404 })
        return api.request(requestPath).catch(error => {
          expect(error).toBeInstanceOf(Error)
        })
      })

      it('returns the response body as a camelCased object', () => {
        global.fetch.mockResponseOnce(
          JSON.stringify({
            user_name: 'user',
            secret_token: '123'
          }),
          { status: 200, headers: defaultResponseHeaders }
        )

        api.request(requestPath).then(res => {
          expect(res).toMatchObject({
            userName: 'user',
            secretToken: '123'
          })
        })
      })

      it('converts the request body to snake_case', () => {
        const options = {
          body: {
            userName: 'Sirius',
            stillAlive: false
          }
        }

        const expectedBody = { user_name: 'Sirius', still_alive: false }

        global.fetch.mockResponseOnce(JSON.stringify({}), {
          status: 200,
          headers: defaultResponseHeaders
        })
        api.request(requestPath, options)
        const jsonRequestBody = JSON.parse(global.fetch.mock.calls[0][1].body)

        expect(jsonRequestBody).toEqual(expectedBody)
        expect(global.fetch).toHaveBeenCalledWith(requestUrl, expect.anything())
      })

      describe('querystring', () => {
        const options = {
          query: {
            name: 'sirius',
            animal: 'dog'
          }
        }

        it('appends a given querystring in a valid format', () => {
          global.fetch.mockResponseOnce(JSON.stringify({}))
          api.request(requestPath, options)

          expect(global.fetch).toHaveBeenCalledWith(
            expect.stringMatching(
              /^.*\?([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?$/
            ),
            expect.anything()
          )
        })

        it('adds the defined key-value-pairs to the querystring', () => {
          global.fetch.mockResponseOnce(JSON.stringify({}))
          api.request(requestPath, options)

          expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('name=sirius', 'animal=dog'),
            expect.anything()
          )
        })
      })

      describe('not json body', () => {
        it('returns empty body when not application/json response', async () => {
          global.fetch.mockResponseOnce(null, {
            headers: {
              ...defaultResponseHeaders,
              'Content-Type': 'application/pdf'
            }
          })
          await expect(api.request(requestPath)).resolves.toMatchObject({})
        })

        it('returns empty body empty', async () => {
          global.fetch.mockResponseOnce(null, {
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': 0
            }
          })
          await expect(api.request(requestPath)).resolves.toMatchObject({})
        })
      })
    })

    describe('with logger', () => {
      describe('single logger', () => {
        it('should call the logger with the requst and response infos', async () => {
          global.fetch.mockResponseOnce(JSON.stringify({}))

          const mockLogger = jest.fn()

          const api = new Snuffles(
            baseUrl,
            {
              method: 'GET',
              headers: { 'X-AUTH-TOKEN': 'token' }
            },
            { logger: mockLogger }
          )

          await api.request(requestPath).then(() => {
            expect(mockLogger.mock.calls).toEqual([
              [
                'request',
                'http://example.com/users',
                {
                  headers: {
                    'X-AUTH-TOKEN': 'token',
                    ...defaultHeaders
                  },
                  method: 'GET'
                }
              ],
              [
                'response',
                {
                  body: {},
                  headers: {
                    map: { 'content-type': 'text/plain;charset=UTF-8' }
                  },
                  status: 200
                }
              ]
            ])
          })
        })

        it('should log an error response', () => {
          global.fetch.mockResponseOnce(JSON.stringify({}), { status: 404 })

          const mockLogger = jest.fn()

          const api = new Snuffles(
            baseUrl,
            {
              method: 'GET',
              headers: { 'X-AUTH-TOKEN': 'token' }
            },
            { logger: mockLogger }
          )

          api.request(requestPath).catch(() => {
            expect(mockLogger.mock.calls).toEqual([
              [
                'request',
                'http://example.com/users',
                {
                  headers: {
                    ...defaultHeaders,
                    'X-AUTH-TOKEN': 'token'
                  },
                  method: 'GET'
                }
              ],
              [
                'response',
                'Error: API response was not ok.',
                expect.any(Response)
              ]
            ])
          })
        })
      })

      describe('2 separate loggers', () => {
        it('should call the individual loggers with the requst and response infos', async () => {
          global.fetch.mockResponseOnce(JSON.stringify({}))

          const mockLoggers = {
            request: jest.fn(),
            response: jest.fn()
          }

          const api = new Snuffles(
            baseUrl,
            {
              method: 'GET',
              headers: { 'X-AUTH-TOKEN': 'token' }
            },
            {
              logger: (type, ...data) => mockLoggers[type](...data)
            }
          )

          await api.request(requestPath).then(() => {
            expect(mockLoggers.request).toHaveBeenCalledWith(
              'http://example.com/users',
              {
                headers: {
                  'X-AUTH-TOKEN': 'token',
                  ...defaultHeaders
                },
                method: 'GET'
              }
            )
            expect(mockLoggers.response).toHaveBeenCalledWith({
              body: {},
              headers: { map: { 'content-type': 'text/plain;charset=UTF-8' } },
              status: 200
            })
          })
        })
      })
    })
  })
})
