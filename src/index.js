'use strict'

import changeCaseObject from 'change-case-object'
import qs from 'query-string'
import merge from 'deepmerge'

const ALLOWED_REQUEST_METHODS = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'CONNTECT',
  'OPTIONS',
  'TRACE',
  'PATCH'
]

export default class Snuffles {

  constructor(baseUrl, defaultOptions = {}) {
    if (!baseUrl) {
      throw new Error('baseUrl has to be set')
    }

    this.baseUrl = baseUrl
    this.defaultOptions = defaultOptions
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

    if(!fullOptions.method || !this.validMethod(fullOptions.method)){
      throw new Error('A valid HTTP request method must be used')
    }

    let queryString = fullOptions.query 
      ? `?${qs.stringify(options.query)}` 
      : ''

    return fetch(`${url}${queryString}`, {
      ...fullOptions
    })
      .then(res => {
        if (!res.ok) throw new Error('API Response was not ok', res)
        return res
      })
      .then(res => res.json())
      .then(json => changeCaseObject.camelCase(json))
    }
}
