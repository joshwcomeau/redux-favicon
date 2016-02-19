import favicoIntegration from './favico-integration';


export default function(favicoOptions) {
  let favicon = favicoIntegration.create(favicoOptions)

  return store => next => action => {
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
