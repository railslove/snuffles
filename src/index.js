import changeCaseObject from 'change-case-object'
import qs from 'query-string'

export default function fetchApi(url, options = {}) {
  let queryString = options.query ? `?${qs.stringify(options.query)}` : ''

  return fetch(`/api/${url}${queryString}`, {
    headers: {
      ...options.headers
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('API Response was not ok', error)
      return res
    })
    .then(res => res.json())
    .then(json => changeCaseObject.camelCase(json))
}
