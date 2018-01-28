import { message } from 'antd';
import fetch from '@f12/fetch';
import { createAction } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const SHOP_OPEN = 'SHOP_OPEN';
const SHOP_CLOSE = 'SHOP_CLOSE';
const SHOP_USER_REQUEST = 'SHOP_USER_REQUEST';
const SHOP_USER_SUCCESS = 'SHOP_USER_SUCCESS';
const SHOP_USER_FAILURE = 'SHOP_USER_FAILURE';
const SHOP_RECORD_CHANGE = 'SHOP_RECORD_CHANGE';
const SHOP_REQUEST = 'SHOP_REQUEST';
const SHOP_SUCCESS = 'SHOP_SUCCESS';
const SHOP_FAILURE = 'SHOP_FAILURE';
const SHOP_SEARCH_CHANGE = 'SHOP_SEARCH_CHANGE';
const SHOP_SEARCH_RESET = 'SHOP_SEARCH_RESET';
const SHOP_SAVE_REQUEST = 'SHOP_SAVE_REQUEST';
const SHOP_SAVE_SUCCESS = 'SHOP_SAVE_SUCCESS';
const SHOP_SAVE_FAILURE = 'SHOP_SAVE_FAILURE';
const SHOP_ROW_SELECT = 'SHOP_ROW_SELECT';
const SHOP_UNBOUND_REQUEST = 'SHOP_UNBOUND_REQUEST';
const SHOP_UNBOUND_SUCCESS = 'SHOP_UNBOUND_SUCCESS';
const SHOP_UNBOUND_FAILURE = 'SHOP_UNBOUND_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  open: createAction(SHOP_OPEN),
  close: createAction(SHOP_CLOSE),
  searchUser: (params) => ({
    types: [SHOP_USER_REQUEST, SHOP_USER_SUCCESS, SHOP_USER_FAILURE],
    callAPI: () => fetch('/shop/phone/list', params),
    payload: params,
  }),
  load: (params) => ({
    types: [SHOP_REQUEST, SHOP_SUCCESS, SHOP_FAILURE],
    callAPI: () => fetch('/shop/bound/list', params),
    payload: params,
  }),
  changeRecord: createAction(SHOP_RECORD_CHANGE, 'fields'),
  changeSearch: createAction(SHOP_SEARCH_CHANGE, 'fields'),
  resetSearch: createAction(SHOP_SEARCH_RESET),
  save: (params) => ({
    types: [SHOP_SAVE_REQUEST, SHOP_SAVE_SUCCESS, SHOP_SAVE_FAILURE],
    callAPI: () => fetch('/shop/add', { userId: params.shopId }),
    payload: params,
    callback: (payload, dispatch, state) => {
      if (payload.success) {
        const sp = {
          ...state.Shop.searchParams,
          pageNo: 1,
          pageSize: 10,
        };
        dispatch(actions.load(sp));
      }
    },
  }),
  selectRow: createAction(SHOP_ROW_SELECT, 'record'),
  unbound: (params) => ({
    types: [SHOP_UNBOUND_REQUEST, SHOP_UNBOUND_SUCCESS, SHOP_UNBOUND_FAILURE],
    callAPI: () => fetch('/shop/unbundle', params),
    payload: params,
    callback: (payload, dispatch, state) => {
      if (payload.success) {
        dispatch(actions.load({
          ...state.Shop.searchParams,
          ...state.Shop.page,
        }));
      }
    },
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SHOP_OPEN]: (state) => (
    {
      ...state,
      visible: true,
    }
  ),
  [SHOP_CLOSE]: (state) => (
    {
      ...state,
      visible: false,
    }
  ),
  [SHOP_USER_REQUEST] : (state) => ({
    ...state,
    userLoading: true,
  }),
  [SHOP_USER_SUCCESS]: (state, action) => ({
    ...state,
    users: action.data,
    selectedRowKeys: [],
    userLoading: false,
  }),
  [SHOP_USER_FAILURE]: (state) => ({
    ...state,
    user: {},
    userLoading: false,
  }),
  [SHOP_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [SHOP_SUCCESS]: (state, action) => ({
    ...state,
    loading: false,
    data: action.data.list,
    page: {
      pageSize: action.data.pageSize,
      pageNo: action.data.pageNo,
      total: action.data.total,
    },
  }),
  [SHOP_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [SHOP_RECORD_CHANGE]: (state, action) => ({
    ...state,
    record: action.fields,
  }),
  [SHOP_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: action.fields,
  }),
  [SHOP_SEARCH_RESET]: (state) => ({
    ...state,
    searchParams: {
      shopName: {
        value: '',
      },
      shopId: {
        value: '',
      },
      shopPhone: {
        value: '',
      },
    },
  }),
  [SHOP_SAVE_REQUEST] : (state) => ({
    ...state,
    confirmLoading: true,
  }),
  [SHOP_SAVE_SUCCESS]: (state) => {
    message.success('操作成功');
    return {
      ...state,
      confirmLoading: false,
      visible: false,
    };
  },
  [SHOP_SAVE_FAILURE]: (state) => ({
    ...state,
    confirmLoading: false,
  }),
  [SHOP_ROW_SELECT]: (state, action) => ({
    ...state,
    record: action.record,
    selectedRowKeys: [action.record.shopId],
  }),
  [SHOP_UNBOUND_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [SHOP_UNBOUND_SUCCESS]: (state) => {
    message.success('解绑成功');
    return {
      ...state,
      loading: false,
    };
  },
  [SHOP_UNBOUND_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  visible: false,
  name: '商家',
  title: '商家管理',
  searchParams: {
    shopName: {
      value: '',
    },
    shopId: {
      value: '',
    },
    shopPhone: {
      value: '',
    },
  },
  users: [],
  record: {},
  selectedRowKeys: [],
  loading: false,
  page: {
    pageSize: 10,
    pageNo: 1,
  },
  bindStatusDict: {
    SUCCESS: '绑定成功',
    REJECT: '绑定失败',
    NOOPERATE: '未绑定',
    UNBUNDLE: '已解绑',
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
