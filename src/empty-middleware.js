export default () => () => next => action => {
  next(action);
};
