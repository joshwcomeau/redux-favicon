// Test suite coverage

import chai, { expect }   from 'chai';
import sinon              from 'sinon';
import sinonChai          from 'sinon-chai';
chai.use(sinonChai);

// favico.js requires a DOM to exist, otherwise it throws.
import jsdom from 'jsdom';
global.document   = jsdom.jsdom('Hi');
global.window     = document.defaultView;
global.navigator  = {
  userAgent: 'node',
  getUserMedia: sinon.spy()
}

// Stub out the '.badge' method called from within src/index.js
import proxyquire from 'proxyquire';
let favicoStub = sinon.stub();
const FakeFavico = function() {
  this.badge = favicoStub
}
const faviconMiddleware = proxyquire('../src/favicon-middleware.js', { 'favico.js': FakeFavico });



describe('faviconMiddleware', () => {
  const next      = sinon.spy();
  const warnStub  = sinon.stub(console, 'warn');
  const errorStub = sinon.stub(console, 'error');

  let storeHandler, nextHandler, actionHandler;

  afterEach( () => {
    // reset our spies and stubs
    next.reset();
    warnStub.reset();
    errorStub.reset();
    favicoStub.reset();
  });

  describe('initialization', () => {
    it('throws when passed a store directly', () => {
      const store = {
        dispatch: function() {},
        getState: function() {}
      };

      faviconMiddleware(store);

      expect(errorStub).to.have.been.calledOnce;
      expect(favicoStub).to.not.have.been.called;
      expect(next).to.not.have.been.called;
    });
  });

  describe('curried application', () => {
    it('loads the middleware with configs, returns a function', () => {
      storeHandler = faviconMiddleware();
      expect(storeHandler).to.be.a('function')
    });

    it('loads the store, and returns a function', () => {
      // We don't use the store in my middleware at all.
      // Pass in an empty object, just to match the real-world input type.
      nextHandler = storeHandler({});
      expect(nextHandler).to.be.a('function')
    });

    it('loads next, and returns a function', () => {
      actionHandler = nextHandler(next);
      expect(actionHandler).to.be.a('function')
    });
  });

  describe('dispatching actions', () => {
    const invalidTypes = [
      null,
      true,
      {},
      [],
      () => {}
    ];

    invalidTypes.forEach( favicon => {
      it('console.warns when an invalid type is supplied', () => {
        const action = { name: 'INVALID', meta: { favicon } };
        actionHandler(action);

        expect(warnStub).to.have.been.calledOnce;
        expect(warnStub.getCall(0).args[0]).to.match(/illegal type/i);

        expect(favicoStub).to.not.have.been.called;
        expect(next).to.have.been.calledOnce;
      });
    });

    it('console.warns when a decimal number is provided', () => {
      const action = { name: 'INVALID', meta: { favicon: 5.4321 } };
      actionHandler(action);

      expect(warnStub).to.have.been.calledOnce;
      expect(warnStub.getCall(0).args[0]).to.match(/integer/i);

      expect(favicoStub).to.not.have.been.called;
      expect(next).to.have.been.calledOnce;
    });

    it('console.warns when an invalid string is provided', () => {
      const action = { name: 'INVALID', meta: { favicon: 'nonsense' } };
      actionHandler(action);

      expect(warnStub).to.have.been.calledOnce;
      expect(warnStub.getCall(0).args[0]).to.match(/string/i);

      expect(favicoStub).to.not.have.been.called;
      expect(next).to.have.been.calledOnce;
    });

    it('rounds negative integer values to 0', () => {
      const action = { name: 'INVALID', meta: { favicon: -12 } };
      actionHandler(action);

      expect(warnStub).to.not.have.been.called;

      expect(favicoStub).to.have.been.called;
      expect(favicoStub.getCall(0).args[0]).to.equal(0);
      expect(next).to.have.been.calledOnce;
    });

    it('accepts integer values', () => {
      const action = { name: 'INVALID', meta: { favicon: 4 } };
      actionHandler(action);

      expect(warnStub).to.not.have.been.called;

      expect(favicoStub).to.have.been.called;
      expect(favicoStub.getCall(0).args[0]).to.equal(4);
      expect(next).to.have.been.calledOnce;
    });



    it('accepts "increment" string value', () => {
      const action = { name: 'INVALID', meta: { favicon: 'increment' } };
      actionHandler(action);

      expect(warnStub).to.not.have.been.called;

      expect(favicoStub).to.have.been.called;
      expect(favicoStub.getCall(0).args[0]).to.equal(5);
      expect(next).to.have.been.calledOnce;
    });

    it('accepts "decrement" string value', () => {
      const action = { name: 'INVALID', meta: { favicon: 'decrement' } };
      actionHandler(action);

      expect(warnStub).to.not.have.been.called;

      expect(favicoStub).to.have.been.called;
      expect(favicoStub.getCall(0).args[0]).to.equal(4);
      expect(next).to.have.been.calledOnce;
    });

    it('accepts "reset" string value', () => {
      const action = { name: 'INVALID', meta: { favicon: 'reset' } };
      actionHandler(action);

      expect(warnStub).to.not.have.been.called;

      expect(favicoStub).to.have.been.called;
      expect(favicoStub.getCall(0).args[0]).to.equal(0);
      expect(next).to.have.been.calledOnce;
    });

    it('is not case-sensitive', () => {
      const action = { name: 'INVALID', meta: { favicon: 'RESET' } };
      actionHandler(action);

      expect(warnStub).to.not.have.been.called;

      expect(favicoStub).to.have.been.called;
      expect(favicoStub.getCall(0).args[0]).to.equal(0);
      expect(next).to.have.been.calledOnce;
    });

    it('forwards actions with no meta.favicon', () => {
      const action = { name: 'UNRELATED_ACTION' };
      actionHandler(action);

      expect(warnStub).to.not.have.been.called;
      expect(favicoStub).to.not.have.been.called;
      expect(next).to.have.been.calledOnce;
    });
  });
});
