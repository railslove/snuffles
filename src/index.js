import changeCaseObject from 'change-case-object'
import qs from 'query-string'
import merge from 'deepmerge'

const ALLOWED_REQUEST_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

const BODY_KEY_CASE_OPTIONS = {
  SNAKE_CASE: 'SNAKE_CASE',
  CAMEL_CASE: 'CAMEL_CASE',
  PARAM_CASE: 'PARAM_CASE'
}

export default class Snuffles {
  constructor(
    baseUrl,
    defaultOptions = {},
    bodyKeyCase = BODY_KEY_CASE_OPTIONS.SNAKE_CASE
  ) {
    if (!baseUrl) {
      throw new Error('baseUrl has to be set')
    }

    if (Object.values(BODY_KEY_CASE_OPTIONS).indexOf(bodyKeyCase) < 0) {
      throw new Error('This formatting option is not allowed.')
    }

    this.baseUrl = baseUrl
    this.defaultOptions = defaultOptions
    this.bodyKeyCase = bodyKeyCase
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
      const casedBody = this.formatBody(requestOptions.body)
      requestOptions.body = JSON.stringify(casedBody)
    }

    return fetch(`${url}${queryString}`, {
      ...requestOptions
    })
      .then(res => {
        if (!res.ok) {
          const error = new Error('API response was not ok.')
          error.response = res
          throw error
        }

        return res
      })
      .then(res => res.json())
      .then(json => changeCaseObject.camelCase(json))
  }

  formatBody(body) {
    switch (this.bodyKeyCase) {
      case BODY_KEY_CASE_OPTIONS.CAMEL_CASE:
        return changeCaseObject.camelCase(body)
      case BODY_KEY_CASE_OPTIONS.SNAKE_CASE:
        return changeCaseObject.snakeCase(body)
      case BODY_KEY_CASE_OPTIONS.PARAM_CASE:
        return changeCaseObject.paramCase(body)
      default:
        return body
    }
  }
}
