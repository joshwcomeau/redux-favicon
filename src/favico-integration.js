import Favico from 'favico.js';

const defaultFavicoOptions  = { animation: 'slide' };
const favicoEnumValues      = [ 'increment', 'decrement', 'reset' ];


export default function(options = defaultFavicoOptions) {
  // Create a new Favico integration.
  // Initially this was going to be a singleton object, but I realized there
  // may be cases where you want several different types of notifications.
  //
  // Not using the constructor pattern, because it obfuscates JS' prototypal
  // nature, and there's no need for inheritance here, so this is equivalent.
  const favico = new Favico(options);

  return {
    // A secret access point, for the rare cases that the Favico instance
    // needs to be interacted with directly.
    __favico: favico,

    currentVal: 0,

    update(value, callback) {
      console.log("Update called with value", value)
      if ( typeof value === 'number' ) {
        // Don't allow non-integer values
        if ( value % 1 !== 0 ) {
          const errorMessage =`
            Warning: Favico not affected.
            You provided a floating-point value: ${value}.
            You need to provide an integer, or a keyword value.
            See <INSERT LINK> for more information.
          `;
          return callback(errorMessage);
        }

        this.currentVal = value;

      } else if ( typeof value === 'string' ) {
        switch ( value.toLowerCase() ) {
          case 'increment': this.currentVal++; break;
          case 'decrement': this.currentVal--; break;
          case 'reset':     this.currentVal=0; break;
          default:
            const errorMessage = `
              Warning: Favico not affected.
              You provided a string value: ${value}.
              The only strings we accept are: ${favicoEnumValues.join(', ')}.
              See <INSERT LINK> for more information.
            `;
            return callback(errorMessage);
        }

      } else {
        const errorMessage = `
          Warning: Favico provided an illegal type.
          You provided a a value of type: ${typeof value}.
          We only accept integers or strings.
          See <INSERT LINK> for more information.
        `;
        return callback(errorMessage);
      }

      // Don't allow negative numbers
      this.currentVal = ( this.currentVal < 0 ) ? 0 : this.currentVal;

      // Set the 'badge' to be our derived value.
      // The favico.js library will show it if it's a positive number,
      // or hide it if it isn't.
      favico.badge(this.currentVal);

      return callback();
    }
  };
}
