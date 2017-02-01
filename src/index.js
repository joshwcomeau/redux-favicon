// if we load in a windowless environment (tests, SSR...), fall back to
// an empty middleware.
if (typeof window === 'undefined') {
  module.exports = require('./empty-middleware');
} else {
  module.exports = require('./favicon-middleware');
}
