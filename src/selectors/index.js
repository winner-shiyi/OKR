// Selectors can compute derived data, allowing Redux to store the minimal possible state.
// Selectors are efficient. A selector is not recomputed unless one of its arguments change.
// Selectors are composable. They can be used as input to other selectors.
// call selectors as regular functions inside mapStateToProps
import { createSelector } from 'reselect';

const getMenus = (state) => state.common.menus;

const getTopMenuKey = (state) => state.common.selectedTopKeys[0];

export const getTopMenus = createSelector(
  [getMenus],
  (menus) => menus || []
);

export const getSideMenus = createSelector(
  [getMenus, getTopMenuKey],
  (menus, key) => {
    const selectedMenu = menus.find((menu) => menu.id === key);
    return (selectedMenu || []).children || [];
  }
);
