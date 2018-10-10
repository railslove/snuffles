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

  _fullUrl(url) {
    return this.baseUrl ? this.baseUrl + url : url
  }

  _validMethod(method) {
    return ALLOWED_REQUEST_METHODS.includes(method.toString())
  }

  // TODO: Documentation
  request(url, options = {}) {
    const fullUrl = this._fullUrl(url)
    const fullOptions = merge(this.defaultOptions, options)

    if(!fullOptions.method || !this._validMethod(fullOptions.method)){
      throw new Error('A valid HTTP request method must be used')
    }

    let queryString = fullOptions.query 
      ? `?${qs.stringify(options.query)}` 
      : ''

    return fetch(`${fullUrl}${queryString}`, {
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

// export default function snuffles(url, options = {}) {
//   let queryString = options.query ? `?${qs.stringify(options.query)}` : ''

//   return fetch(`${url}${queryString}`, {
//     headers: {
//       ...options.headers
//     }
//   })
//     .then(res => {
//       if (!res.ok) throw new Error('API Response was not ok', res)
//       return res
//     })
//     .then(res => res.json())
//     .then(json => changeCaseObject.camelCase(json))
// }
