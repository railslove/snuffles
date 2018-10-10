import changeCaseObject from 'change-case-object'
import qs from 'query-string'

export default function snuffles(url, options = {}) {
  let queryString = options.query ? `?${qs.stringify(options.query)}` : ''

  return fetch(`${url}${queryString}`, {
    headers: {
      ...options.headers
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('API Response was not ok', res)
      return res
    })
    .then(res => res.json())
    .then(json => changeCaseObject.camelCase(json))
}
