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

Import the module into your configure-store file, pre-load it with settings, and apply it to the store:

```js
/* configure-store.js */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import faviconMiddleware from 'redux-sounds';

import reducer from '../reducers';

// Redux Favicon accepts a configuration object. The options are explained below.
const faviconConfig = {
  animation:  'slide',
  position:   'up',
  type:       'rectangle',
  bgColor:    '#123456',
  textColor:  '#314159'
};

// Pre-load our middleware with our config.
const loadedFaviconMiddleware = faviconMiddleware(faviconConfig);

// Use as you would any other middleware.
const store = createStore(reducer, applyMiddleware(loadedFaviconMiddleware));
// (Using the condensed createStore released in Redux v3.1.0)
```

The config file is optional, but you do need to invoke the favicon middleware either way:

```js
// Note that faviconMiddleware is being invoked:
const store = createStore(reducer, applyMiddleware( faviconMiddleware() ));
```

## Options

Redux Favicon uses [Favico.js](http://lab.ejci.net/favico.js/) v0.3.10 under the hood. Favico.js offers some additional bells and whistles that are untested with this middleware, but the following options are supported:

| Attribute  | Default    | Details                                                                                    |
|------------|------------|----------------------------------------------------------------------------------------------------------|
| bgColor    | #d00       | Badge background color                                                                                   |
| textColor  | #fff       | Badge text color                                                                                         |
| fontFamily | sans-serif | Text font family (Arial, Verdana, Times New Roman, serif, sans-serif,...)                                |
| fontStyle  | bold       | Font style (normal, italic, oblique, bold, bolder, lighter, 100, 200, 300, 400, 500, 600, 700, 800, 900) |
| type       | circle     | Badge shape (circle, rectangle)                                                                          |
| position   | down       | Badge position (up, down, left, upleft)                                                                  |
| animation  | slide      | Badge animation type (slide, fade, pop, popFade, none )                                                  |

## Usage

Once your store is created, dispatching actions that trigger sounds is simple.

Using the convention established in the [rafScheduler Middleware example](https://github.com/rackt/redux/blob/46083e73d952feb367bf3fa4e13c1e419a224100/docs/advanced/Middleware.md#seven-examples), a new `meta` property can be attached to actions.

By attaching a `favicon` property to the `meta` object, you can specify the new number you'd like to display. Several convenience strings are offered as well.

Examples:

```js
// Set a new badge number.
// Accepts any integer.
// Sending 0 or a negative number hides the badge.
{
  type: UPDATE_SCORE,
  meta: {
    favicon: 12
  }
}

// Increase the current favicon number by 1.
// If there is no favicon badge currently displayed, it will be set to `1`
{
  type: RECEIVE_MESSAGE,
  meta: {
    favicon: 'increment'
  }
}

// Decrease the current favicon number by 1.
// If the current value is 1 or lower, this action removes the badge.
{
  type: RECEIVE_MESSAGE,
  meta: {
    favicon: 'decrement'
  }
}

// Remove the badge
// This is equivalent to sending a value of `0`
{
  type: RECEIVE_MESSAGE,
  meta: {
    favicon: 'reset'
  }
}

```

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
