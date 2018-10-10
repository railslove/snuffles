# Snuffles

> A wrapper around the native fetch function, returning the response body as a camelCased object

## Todo
- [x] Documentation
- [x] Testing
- [ ] Rewrite as a class
- [ ] Use throughout different projects
- [ ] Tidy up
- [ ] a e s t e t h i c logo~~
- [ ] Publish

## Installation

```bash
npm install --save snuffles
```

## Usage

```jsx
import snuffles from 'snuffles'

export default function myApiWrapper() {
  const options = {
    query: {
      'name': 'sirius',
      'animal': 'dog'
    },
    headers: {
      'X-AUTH-TOKEN': 'token'
    }
  }

  snuffles('http://example.com/users', options)
}
```

As of now, snuffles consist of one function to make `GET` requests.

**`snuffles(url, options)`**
* `url`: The url to make the request against
* `options`: Takes multiple options
  * `query`: An object to build a query string of
  * `headers`: An object of headers to set for the request

Snuffles will return the response body as a camelCased object.

## License

MIT © [railslove](https://github.com/railslove)
