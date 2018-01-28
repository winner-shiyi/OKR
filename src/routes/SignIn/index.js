import { injectReducer } from '../../store/reducers';

export const moduleName = 'SignIn';

export default (store) => ({
  path : moduleName,
  onEnter: (opts, replace, next) => {
    if (localStorage.getItem('accessToken')) {
      replace('/Manage');
    }
    next();
  },
  onLeave: () => {
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const container = require('./containers').default;
      const reducer = require('./modules').default;
      injectReducer(store, { key: moduleName, reducer });
      cb(null, container);
    });
  },
});
