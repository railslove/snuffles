import changeCaseObject from 'change-case-object'
import qs from 'query-string'
import merge from 'deepmerge'

const ALLOWED_REQUEST_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH'
]

export default class Snuffles {
  constructor(baseUrl, defaultOptions = {}, metaOptions = {}) {
    if (!baseUrl) {
      throw new Error('baseUrl has to be set')
    }

    this.baseUrl = baseUrl
    this.defaultOptions = defaultOptions

    if (typeof metaOptions.logger === 'function') {
      this.log = metaOptions.logger
    } else {
      this.log = () => {}
    }
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
    const fullOptions = merge(this.defaultOptions, options)

    if (!fullOptions.method || !this.validMethod(fullOptions.method)) {
      throw new Error('A valid HTTP request method must be used')
    }

    const queryString = fullOptions.query
      ? `?${qs.stringify(options.query)}`
      : ''

    const { query, ...requestOptions } = fullOptions

    if (requestOptions.body) {
      const snakeCasedBody = changeCaseObject.snakeCase(requestOptions.body)
      requestOptions.body = JSON.stringify(snakeCasedBody)
    }

    const urlWithQueryString = `${url}${queryString}`
    this.log(urlWithQueryString, requestOptions)
    return fetch(urlWithQueryString, {
      ...requestOptions
    })
      .then(res => {
        if (!res.ok) {
          const error = new Error('API response was not ok.')
          this.log({...res, error})
          error.response = res
          throw error
        }

        return res
      })
      .then(res => res.json())
      .then(json => {
        const casedResponse = changeCaseObject.camelCase(json)
        this.log(casedResponse)
        return casedResponse
      })
  }
}
