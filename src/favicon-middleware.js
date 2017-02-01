import Favico from 'favico.js';


// The middleware is kept as simple as possible.
// All favicon operations are delegated to a function below.
export default function(favicoOptions) {
  // Detect if this middleware is being used without being 'preloaded',
  // by being passed a store instead of favicoOptions
  if ( favicoOptions && typeof favicoOptions.getState === 'function' ) {
    console.error(`
      redux-favicon middleware not preloaded!
      You need to first call reduxFavicon with its configuration to initialize it, THEN pass it to createStore.

      See https://github.com/joshwcomeau/redux-favicon#setup`
    );
  }

  let favicon = favicoIntegration(favicoOptions)

  return store => next => action => {
    // Ignore actions that don't tweak the favicon
    if ( !action.meta || typeof action.meta.favicon === 'undefined' ) {
      return next(action);
    }

    favicon.update(action.meta.favicon, err => {
      if (err) console.warn(err);

      return next(action);
    })
  }
}

const defaultFavicoOptions  = { animation: 'slide' };
const favicoEnumValues      = [ 'increment', 'decrement', 'reset' ];

// This integration communicates directly with Favico.js to set the badge.
function favicoIntegration(options = defaultFavicoOptions) {
  // Create a new Favico integration.
  // Initially this was going to be a singleton object, but I realized there
  // may be cases where you want several different types of notifications.
  // The middleware does not yet support multiple instances, but it should
  // be easy to add if there's demand :)
  //
  // Not using the constructor pattern, because it obfuscates JS' prototypal
  // nature, and there's no need for inheritance here, so this is equivalent.
  const favico = new Favico(options);

  return {
    currentVal: 0,

    update(value, callback) {
      if ( typeof value === 'number' ) {
        // Don't allow non-integer values
        if ( value % 1 !== 0 ) {
          return callback(`
            Warning: Favico not affected.
            You provided a floating-point value: ${value}.
            You need to provide an integer, or a keyword value.

            See https://github.com/joshwcomeau/redux-favicon#troubleshooting for more information.
          `);
        }

        this.currentVal = value;

      } else if ( typeof value === 'string' ) {
        switch ( value.toLowerCase() ) {
          case 'increment': this.currentVal++; break;
          case 'decrement': this.currentVal--; break;
          case 'reset':     this.currentVal=0; break;
          default:
            return callback(`
              Warning: Favico not affected.
              You provided a string value: ${value}.
              The only strings we accept are: ${favicoEnumValues.join(', ')}.

              See https://github.com/joshwcomeau/redux-favicon#troubleshooting for more information.
            `);
        }

      } else {
        // Annoyingly, istanbul won't give me 100% coverage unless all possible
        // typeof values are checked. It is not possible for all types to make
        // it to this check; `undefined` aborts earlier.
        /* istanbul ignore next */
        const provided_type = typeof value;

        return callback(`
          Warning: Favico provided an illegal type.
          You provided a a value of type: ${provided_type}.
          We only accept integers or strings.

          See https://github.com/joshwcomeau/redux-favicon#troubleshooting for more information.
        `);
      }

      // Don't allow negative numbers
      this.currentVal = ( this.currentVal < 0 ) ? 0 : this.currentVal;

      // Set the 'badge' to be our derived value.
      // The favico.js library will show it if it's truthy, hide it if falsy.
      favico.badge(this.currentVal);

      return callback();
    }
  };
}
