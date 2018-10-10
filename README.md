# Snuffles

> A wrapper around the native fetch function, returning the response body as a camelCased object

## Installation

```bash
npm install --save snuffles
```

## Usage

```jsx
import Snuffles from 'snuffles'

export default function myApiWrapper() {
  cosnt defaultOptions = {
    headers: {
      'X-AUTH-TOKEN': 'my-secret-token'
    }
  }

  const api = new Snuffles('http://base-url.tld', defaultOptions)
  
  const user = api.get('/user')
}
```

To create a new instance of Snuffles:
```js
const api = new Snuffles(baseUrl[, {defaultOptions}])
```
* __`baseUrl`__: The base url of the API you want to make requests agains
* __`defaultOptions`__ (_optional_): A set of default options you want to sent in every request, e.g. headers for authentication

As of now, Snuffles has wrappers for 5 request methods:
* `get(path[, {options}])`
* `post(path[, {options}])`
* `put(path[, {options}])`
* `patch(path[, {options}])`
* `delete(path[, {options}])`

Where
* __`path`__: the path you want that specific request to go to
* __`options`__ (_optional_): options you want to merge with the base options on this specific request. Options passed to the wrapper functions are deep-merged, but will override identical keys.

### Options
Snuffles accepts all options that fetch accepts as its `init` parameter ([docs](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)). In fact, snuffles does not validate the options that are passed at all.  

### Using querystrings
Snuffles does support the setting of querystrings via its options parameter. You can pass in a `query` object with the desired key-value-pairs.  
For example:

```js
const api = new Snuffles('http://base-url.tld')

const options = {
  query: {
    'name': 'sirius',
    'animal': 'dog'
  }
}

const user = api.get('/user')

// => fetch('http://base-url.tld/user?name=sirius&animal=dog')
```

Snuffles will return the response body as a camelCased object for you to work with.

## License
<p align="center">
  ![](logo_rl.svg =250x)
</p>
<p align="center">
  Made with 💚 in Cologne
</p>


MIT © [railslove](https://github.com/railslove)
