import snuffles from './'
global.fetch = require('jest-fetch-mock')

describe('snuffles', () => {
  beforeEach(() => {
    global.fetch.resetMocks()
  })

  it('makes a request to the given url', () => {
    global.fetch.mockResponseOnce(JSON.stringify({}))
    snuffles('http://example.com')

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith('http://example.com', expect.anything())
  })

  it('throws an error if the status code was not 200', () => {
    global.fetch.mockResponseOnce(JSON.stringify({}), { status: 404 })
    return snuffles('http://example.com').catch(error => {
      expect(error).toBeInstanceOf(Error)
    })
  })

  it('sets the defined headers', () => {
    const options = {
      headers: {
        'X-AUTH-TOKEN': 'secret'
      }
    }
    global.fetch.mockResponseOnce(JSON.stringify({}))
    snuffles('http://example.com', options)

    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.com',
      expect.objectContaining(options)
    )
  })

  it('returns the response body as a camelCased object', () => {
    global.fetch.mockResponseOnce(JSON.stringify({
      user_name: 'user',
      secret_token: '123'
    }))

    snuffles('http://example.com').then(res => {
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
      snuffles('http://example.com', options)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/^.*\?([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?$/),
        expect.anything()
      )
    })

    it('adds the defined key-value-pairs to the querystring', () => {
      global.fetch.mockResponseOnce(JSON.stringify({}))
      snuffles('http://example.com', options)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('name=sirius', 'animal=dog'),
        expect.anything()
      )
    })
  })
})
