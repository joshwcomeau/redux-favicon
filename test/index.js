// Test suite coverage
// Sadly, Howler.js will not try to load or play any sounds when there is
// no audio environment available. Node has no audio environment.
// We'll test the middleware instantiation, how it handles actions, whether
// it hands the right data to Howler, and some other configuration stuff.
//
import chai, { expect }   from 'chai';
import sinon              from 'sinon';
import sinonChai          from 'sinon-chai';
import Favico             from 'favico.js';

import faviconMiddleware  from '../src/index';

chai.use(sinonChai);



describe('faviconMiddleware', () => {
  it('works', () => {
    expect(true).to.equal(true);
  })
});
