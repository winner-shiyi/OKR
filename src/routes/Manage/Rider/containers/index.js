import { connect } from 'react-redux';
import { actions } from '../modules';
import { moduleName } from '../index';
import selectors from '../selectors';

import View from '../components';

const mapDispatchToProps = {
  ...actions,
};

const mapStateToProps = (state) => {
  const localState = state[moduleName];
  return {
    ...localState,
    confirmDisabled: selectors.getConfirmDisabled(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
