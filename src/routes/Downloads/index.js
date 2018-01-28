/* eslint-disable import/no-dynamic-require */
import { injectReducer } from '../../store/reducers';
import QRCode from './QRCode';
import { common } from '../../store/common';

const createRoutes = (store) => ({
  path        : '/Downloads',
  indexRoute  : QRCode,
  onEnter: (opts, replace, next) => {
    next();
  },
  onLeave: () => {
  },
  childRoutes : [
    QRCode(store),
  ],
});

export function createChildRoutes(moduleName, id) {
  let path = moduleName;
  if (id) {
    path += `/:${id}`;
  }
  return (store) => ({
    path,
    onEnter: (opts, replace, next) => {
      store.dispatch(common.initMenu());
      next();
    },
    onLeave: () => {
    },
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        const container = require(`./${moduleName}/containers`).default;
        const reducer = require(`./${moduleName}/modules`).default;
        injectReducer(store, { key: moduleName, reducer });
        cb(null, container);
      });
    },
  });
}

export default createRoutes;
