import Home from './Home';
import SignInRoute from './SignIn';
import ManageRoute from './Manage';
import DefaultRoute from './404';
import ErrorRoute from './Error';


const createRoutes = (store) => ({
  path        : '/',
  component   : null,
  indexRoute  : Home,
  onEnter: ({ location }, replace, next) => {
    console.log('onEnter location', location);
    next();
  },
  onLeave: () => {
  },
  childRoutes : [
    SignInRoute(store),
    ManageRoute(store),
    ErrorRoute(store),
    // this line should put at last
    DefaultRoute(store),
  ],
});

export default createRoutes;
