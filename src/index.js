import favicoIntegration from './favico-integration';


export default function(favicoOptions = {}) {
  // Detect if this middleware is being used without being 'preloaded',
  // by being passed a store instead of favicoOptions
  if ( typeof favicoOptions.getState === 'function' ) {
    console.error('redux-favicon middleware not preloaded! \nYou need to first call reduxFavicon with its configuration to initialize it, THEN pass it to createStore.\n\nSee https://github.com/joshwcomeau/redux-favico/#troubleshooting')
  }

  let favicon = favicoIntegration(favicoOptions)

  return store => next => action => {
    console.log("Action:", action)
    // Ignore actions that don't tweak the favico
    if ( !action.meta || typeof action.meta.favico === 'undefined' ) {
      return next(action);
    }

    favicon.update(action.meta.favico, err => {
      if (err) console.warn(err);

      return next(action);
    })
  }
}
