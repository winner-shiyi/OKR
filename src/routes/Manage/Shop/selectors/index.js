import { createSelector } from 'reselect';

const getSelectedRowKeys = (state) => state.Shop.selectedRowKeys;

const getConfirmDisabled = createSelector(
  [getSelectedRowKeys],
  (selectedRowKeys) => !selectedRowKeys[0],
);

const selectors = {
  getConfirmDisabled,
};

export default selectors;
