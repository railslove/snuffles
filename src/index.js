import changeCaseObject from 'change-case-object'
import MetaOptions from './MetaOptions'
import qs from 'query-string'
import merge from 'deepmerge'

const ALLOWED_REQUEST_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

const defaultMetaOptions = { bodyKeyCase: 'SNAKE_CASE', logger: () => {} }

export default class Snuffles {
  constructor(baseUrl, defaultRequestOptions = {}, metaOptions = {}) {
    if (!baseUrl) {
      throw new Error('baseUrl has to be set')
    }

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...defaultRequestOptions.headers
    }

    this.baseUrl = baseUrl
    this.defaultRequestOptions = { ...defaultRequestOptions, headers }
    this.metaOptions = new MetaOptions({
      ...defaultMetaOptions,
      ...metaOptions
    })
    this.log = this.metaOptions.logger
  }

  get(path, options = {}) {
    return this.request(path, { ...options, method: 'GET' })
  }

  post(path, options = {}) {
    return this.request(path, { ...options, method: 'POST' })
  }

  put(path, options = {}) {
    return this.request(path, { ...options, method: 'PUT' })
  }

  patch(path, options = {}) {
    return this.request(path, { ...options, method: 'PATCH' })
  }

  delete(path, options = {}) {
    return this.request(path, { ...options, method: 'DELETE' })
  }

  fullUrl(path) {
    return this.baseUrl + path
  }

  validMethod(method) {
    return ALLOWED_REQUEST_METHODS.includes(method.toString())
  }

  /**
   * @param  {string} path the path of the request
   * @param  {Object} options optional options, sepcific for this single request
   * @return {Object} res camelCased response
   */
  request(path, options = {}) {
    const url = this.fullUrl(path)
    const fullOptions = merge(this.defaultRequestOptions, options)

    if (!fullOptions.method || !this.validMethod(fullOptions.method)) {
      throw new Error('A valid HTTP request method must be used')
    }

    const queryString = fullOptions.query
      ? `?${qs.stringify(options.query)}`
      : ''

    const { query, ...requestOptions } = fullOptions

    if (requestOptions.body) {
      const casedBody = this.formatBody(requestOptions.body)
      requestOptions.body = JSON.stringify(casedBody)
    }

    const urlWithQueryString = `${url}${queryString}`
    this.log('request', urlWithQueryString, requestOptions)
    return fetch(urlWithQueryString, {
      ...requestOptions
    })
      .then(res => {
        if (!res.ok) {
          const error = new Error('API response was not ok.')
          this.log({ ...res, error })
          error.response = res
          throw error
        }

        return res
      })
      .then(res => {
        const headers = {}
        for (let pair of res.headers.entries()) {
          headers[pair[0]] = pair[1]
        }

        if (headers['content-type'] === 'application/json') {
          return res.json().then(json => {
            return {
              status: res.status,
              headers,
              body: json
            }
          })
        } else {
          return { status: res.status, headers, body: {} }
        }
      })
      .then(parsedResponse => {
        parsedResponse.body = changeCaseObject.camelCase(parsedResponse.body)
        this.log('response', parsedResponse)
        return parsedResponse.body
      })
  }

  formatBody(body) {
    return this.metaOptions.getBodyKeyConverter()(body)
  }
}
