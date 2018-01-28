import { connect } from 'react-redux';
import { actions } from '../modules';
import { moduleName } from '../index';
import { common } from '../../../store/common';

import View from '../components';

const mapDispatchToProps = {
  ...actions,
  showEditPwd: common.showEditPwd,
  initCommon: common.initCommon,
};

const mapStateToProps = (state) => {
  const localState = state[moduleName];
  return {
    ...localState,
    editPwdVisible: state.common.editPwdVisible,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
