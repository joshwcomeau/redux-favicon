// Add favicon tweaks in response to actions.
import Favico from 'favico.js';


const defaultFavicoOptions  = { animation: 'slide' };
const favicoEnumValues      = [ 'increment', 'decrement', 'reset' ];

export default function(favicoOptions = defaultFavicoOptions) {
  const favico  = new Favico(favicoOptions);
  let favicoVal = 0;

  return store => next => action => {
    // Ignore actions that don't tweak the favico
    if ( !action.meta || typeof action.meta.favico === 'undefined' ) {
      return next(action);
    }

    // The 'favico' meta value can either be an integer,
    // in which case we set it directly to that number.
    // It also supports special strings 'increment'/'decrement'/'reset'.
    const suppliedFavicoVal = action.meta.favico;

    if ( typeof suppliedFavicoVal === 'number' ) {
      // Don't allow non-integer values
      if ( suppliedFavicoVal % 1 !== 0 ) {
        console.warn(`
          Warning: Favico not affected.
          You provided a floating-point value: ${suppliedFavicoVal}.
          You need to provide an integer, or a keyword value.
          See <INSERT LINK> for more information.
        `);
        return next(action);
      }

      favicoVal = suppliedFavicoVal;
    } else {
      switch ( suppliedFavicoVal.toLowerCase() ) {
        case 'increment': favicoVal++; break;
        case 'decrement': favicoVal--; break;
        case 'reset':     favicoVal=0; break;
        default:
          console.warn(`
            Warning: Favico not affected.
            You provided a string value: ${suppliedFavicoVal}.
            The only strings we accept are 'increment', 'decrement' or 'reset'.
            See <INSERT LINK> for more information.
          `);
          return next(action);
      }
    }

    // Don't allow negative numbers
    favicoVal = ( favicoVal < 0 ) ? 0 : favicoVal;

    // Set the 'badge' to be our derived value.
    // The favico.js library will show it if it's a positive number,
    // or hide it if it isn't.
    favico.badge(favicoVal);
    return next(action);
  }
}
