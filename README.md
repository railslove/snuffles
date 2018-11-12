<p align="center">
  <img src="logo.jpg">
</p>

> A wrapper around the native fetch function, providing a more convenient way to use it for JSON requests

![](https://travis-ci.org/railslove/snuffles.svg?branch=master)
![](https://img.shields.io/github/license/railslove/snuffles.svg)
![](https://img.shields.io/github/tag/railslove/snuffles.svg)
![](https://img.shields.io/npm/v/snuffles.svg)

At its core, Snuffles is just a very slim wrapper around the [native `fetch` function](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch). It allows for setting a base url and default options for your request, provides some wrappers around some of the more frequently used HTTP methods and takes care of all casing. You send camelCased objects in, you get camelCased objects out.

## Installation

```bash
npm install --save snuffles
```

## Usage

```jsx
import Snuffles from 'snuffles'

export default function myApiWrapper() {
  const defaultOptions = {
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
const api = new Snuffles(baseUrl[, defaultOptions, bodyFormat])
```

- **`baseUrl`**: The base url of the API you want to make requests agains
- **`defaultOptions`** (_optional_): An Object, containing a set of default options you want to sent in every request, e.g. headers for authentication
- **`bodyForma`** (_optional_): A string representing the format in which a request body should be sent out. Accepts `SNAKE_CASE` (default), `CAMEL_CASE` and `PARAM_CASE`.

As of now, Snuffles has wrappers for 5 request methods:

- `get(path[, options])`
- `post(path[, options])`
- `put(path[, options])`
- `patch(path[, options])`
- `delete(path[, options])`

Where

- **`path`**: the path you want that specific request to go to
- **`options`** (_optional_): An Object containing a set of options you want to merge with the base options on this specific request. Options passed to the wrapper functions are deep-merged, but will override identical keys.

### Options

Snuffles accepts all options that fetch accepts as its `init` parameter ([docs](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)). In fact, snuffles does not validate the options that are passed at all.

### Using querystrings

Snuffles does support the setting of querystrings via its options parameter. You can pass in a `query` object with the desired key-value-pairs.
For example:

```js
const api = new Snuffles('http://base-url.tld')

const options = {
  query: {
    name: 'sirius',
    animal: 'dog'
  }
}

const user = api.get('/user', options)

// => fetch('http://base-url.tld/user?name=sirius&animal=dog')
```

### Casing

Snuffles will take care of transforming the casing of response and request
bodies, so that you can pass in a camelCased object as a request body (passed
via `options.body`) and get out the response body as a camelCased object as
well.

#### Response bodies

Assuming `GET https://your-api/users/1` would return a response with a body of

```json
{
  "user_name": "John Doe",
  "paid_user": false
}
```

If you make this request with snuffles, it would look like

```js
const api = new Snuffles('https://your-api')

const res = api.get('/users/1')

// res =>
// {
//   userName: "John Doe",
//   paidUser: false
// }
//
```

#### Request bodies:

```js
const api = new Snuffles('http://base-url.tld')

const options = {
  body: {
    userName: 'sirius',
    paidUser: true
  }
}

api.post('/users', options)

// sends a request to 'http://base-url.tld/users', with the body
// {
//    user_name: 'sirius',
//    paid_user: true
// }
```

## License

MIT © [railslove](https://github.com/railslove)

Dog Illustrastion from [Pixabay](https://pixabay.com/en/pug-unicorn-dog-animal-puppy-2970825/) under CC0-License.

<p align="center">
  <img src="logo_rl.svg" width="500px" >
</p>
<p align="center">
  Made with 💚 in Cologne
</p>
