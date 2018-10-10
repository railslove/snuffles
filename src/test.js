import Snuffles from './index.js'
global.fetch = require('jest-fetch-mock')

const baseUrl = 'http://example.com'
const requestPath = '/users'
const requestUrl = baseUrl + requestPath

describe('snuffles', () => {
  beforeEach(() => {
    global.fetch.resetMocks()
  })

  describe('initialization', () => {
    it('is not valid without a basUrl', () => {
      expect(() => new Snuffles()).toThrow()
    })

    it('is valid without defaultOptions', () => {
      const api = new Snuffles('http://www.example.com')
      expect(api).toBeTruthy()
    })

    it('sets the baseUrl and default options', () => {
      const baseUrl = 'http://www.example.com'
      const defaultOptions = {
        headers: {
          'X-AUTH-TOKEN': 'secret'
        }
      }

      const api = new Snuffles(baseUrl, defaultOptions)
      expect(api.baseUrl).toEqual(baseUrl)
      expect(api.defaultOptions).toEqual(defaultOptions)
    })
  })

  describe('request', () => {
    describe('without default options', () => {
      let api

      beforeEach(() => {
        global.fetch.resetMocks()
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
        global.fetch.resetMocks()
        api = new Snuffles(
          baseUrl,
          { 
            method: 'GET',
            headers: { 'X-AUTH-TOKEN': 'token' },
          }
        )
      })

      it('makes a request to the given url', () => {
        global.fetch.mockResponseOnce(JSON.stringify({}))
        api.request(requestPath)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(
          requestUrl,
          expect.anything()
        )
      })

      it('merges the passed options with the defaultOptions', () => {
        const options = {
          headers: {
            'X-ALLOW-FRAME': 'SAMEORIGIN'
          }
        }

        const mergedOptions = {
          method: 'GET',
          headers: {
            'X-ALLOW-FRAME': 'SAMEORIGIN',
            'X-AUTH-TOKEN': 'token'
          }
        }

        global.fetch.mockResponseOnce(JSON.stringify({}))
        api.request(requestPath, options)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(requestUrl, expect.objectContaining(mergedOptions))
      })

      it('merges the passed url with the baseUrl', () => {
        global.fetch.mockResponseOnce(JSON.stringify({}))
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

      it('sets the defined options', () => {
        const options = {
          headers: {
            'X-AUTH-TOKEN': 'secret'
          }
        }
        global.fetch.mockResponseOnce(JSON.stringify({}))
        api.request(requestPath, options)

        expect(global.fetch).toHaveBeenCalledWith(
          requestUrl,
          expect.objectContaining(options)
        )
      })

      it('returns the response body as a camelCased object', () => {
        global.fetch.mockResponseOnce(JSON.stringify({
          user_name: 'user',
          secret_token: '123'
        }))

        api.request(requestPath).then(res => {
          expect(res).toMatchObject({
            userName: 'user',
            secretToken: '123'
          })
        })
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
            expect.stringMatching(/^.*\?([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?$/),
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
    })
  })

  describe('wrappers', () => {
    let api
    beforeEach(() => {
      global.fetch.resetMocks()
      api = new Snuffles(baseUrl,{ method: 'GET' })
    })

    it('get', () => {
      api.request = jest.fn()

      api.get(requestPath)
      expect(api.request).toHaveBeenCalledTimes(1)
    })

    it('post', () => {
      api.request = jest.fn()

      api.post(requestPath)
      expect(api.request).toHaveBeenCalledTimes(1)
    })

    it('put', () => {
      api.request = jest.fn()

      api.put(requestPath)
      expect(api.request).toHaveBeenCalledTimes(1)
    })

    it('patch', () => {
      api.request = jest.fn()

      api.patch(requestPath)
      expect(api.request).toHaveBeenCalledTimes(1)
    })

    it('delete', () => {
      api.request = jest.fn()

      api.delete(requestPath)
      expect(api.request).toHaveBeenCalledTimes(1)
    })
  })
})
