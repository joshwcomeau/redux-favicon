Redux Favicon
=============

[![build status](https://img.shields.io/travis/joshwcomeau/redux-favicon/master.svg?style=flat-square)](https://travis-ci.org/joshwcomeau/redux-favicon)
[![npm version](https://img.shields.io/npm/v/redux-favicon.svg?style=flat-square)](https://www.npmjs.com/package/redux-favicon)


Redux [middleware](http://rackt.org/redux/docs/advanced/Middleware.html) that lets you display notification badges in the favicon:

![](https://s3.amazonaws.com/githubdocs/favico.gif)

Uses [Favico.js](http://lab.ejci.net/favico.js/) under the hood, exposing its customization when needed but allowing you to display notification badges as easily as:

```js
// app.actions.js

export function newMessage() {
  return {
    type: 'NEW_MESSAGE',
    meta: { favicon: 'increment' }
  }
}
```


## Installation

#### Preferred: NPM

```js
npm i -S redux-favicon
```


#### Also available: UMD

UMD builds are also available, for single-file usage or quick hacking in a JSbin. Simply add `dist/redux-favicon.js` or `dist/redux-favicon.min.js` to your file in a `<script>` tag. The middleware will be available under `ReduxSounds`.


## Setup

TODO

## Usage

TODO

## Troubleshooting

TODO

## Tests

To run: `npm run test`

Using Mocha for test-running, Chai Expect for assertions, and Istanbul for test coverage.


## Planned functionality

TODO


## Contributions

Contributors welcome! Please discuss additional features with me before implementing them, and please supply tests along with any bug fixes.


## License

[MIT](https://github.com/joshwcomeau/redux-favicon/blob/master/LICENSE.md)
