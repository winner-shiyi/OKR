import { message } from 'antd';
import fetch from '@f12/fetch';
import { createAction } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const RIDER_OPEN = 'RIDER_OPEN';
const RIDER_CLOSE = 'RIDER_CLOSE';
const RIDER_USER_REQUEST = 'RIDER_USER_REQUEST';
const RIDER_USER_SUCCESS = 'RIDER_USER_SUCCESS';
const RIDER_USER_FAILURE = 'RIDER_USER_FAILURE';
const RIDER_RECORD_CHANGE = 'RIDER_RECORD_CHANGE';
const RIDER_REQUEST = 'RIDER_REQUEST';
const RIDER_SUCCESS = 'RIDER_SUCCESS';
const RIDER_FAILURE = 'RIDER_FAILURE';
const RIDER_SEARCH_CHANGE = 'RIDER_SEARCH_CHANGE';
const RIDER_SEARCH_RESET = 'RIDER_SEARCH_RESET';
const RIDER_SAVE_REQUEST = 'RIDER_SAVE_REQUEST';
const RIDER_SAVE_SUCCESS = 'RIDER_SAVE_SUCCESS';
const RIDER_SAVE_FAILURE = 'RIDER_SAVE_FAILURE';
const RIDER_ROW_SELECT = 'RIDER_ROW_SELECT';
const RIDER_UNBOUND_REQUEST = 'RIDER_UNBOUND_REQUEST';
const RIDER_UNBOUND_SUCCESS = 'RIDER_UNBOUND_SUCCESS';
const RIDER_UNBOUND_FAILURE = 'RIDER_UNBOUND_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  open: createAction(RIDER_OPEN),
  close: createAction(RIDER_CLOSE),
  searchUser: (params) => ({
    types: [RIDER_USER_REQUEST, RIDER_USER_SUCCESS, RIDER_USER_FAILURE],
    callAPI: () => fetch('/rider/phone/list', params),
    payload: params,
  }),
  load: (params) => ({
    types: [RIDER_REQUEST, RIDER_SUCCESS, RIDER_FAILURE],
    callAPI: () => fetch('/rider/bound/list', params),
    payload: params,
  }),
  changeRecord: createAction(RIDER_RECORD_CHANGE, 'fields'),
  changeSearch: createAction(RIDER_SEARCH_CHANGE, 'fields'),
  resetSearch: createAction(RIDER_SEARCH_RESET),
  save: (params) => ({
    types: [RIDER_SAVE_REQUEST, RIDER_SAVE_SUCCESS, RIDER_SAVE_FAILURE],
    callAPI: () => fetch('/rider/add', { userId: params.riderId }),
    payload: params,
    callback: (payload, dispatch, state) => {
      // no matter success or failure, reload the list
      const sp = {
        ...state.Rider.searchParams,
        pageNo: 1,
        pageSize: 10,
      };
      dispatch(actions.load(sp));
    },
  }),
  selectRow: createAction(RIDER_ROW_SELECT, 'record'),
  unbound: (params) => ({
    types: [RIDER_UNBOUND_REQUEST, RIDER_UNBOUND_SUCCESS, RIDER_UNBOUND_FAILURE],
    callAPI: () => fetch('/rider/unbundle', params),
    payload: params,
    callback: (payload, dispatch, state) => {
      if (payload.success) {
        dispatch(actions.load({
          ...state.Rider.searchParams,
          ...state.Rider.page,
        }));
      }
    },
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RIDER_OPEN]: (state) => (
    {
      ...state,
      visible: true,
    }
  ),
  [RIDER_CLOSE]: (state) => (
    {
      ...state,
      visible: false,
    }
  ),
  [RIDER_USER_REQUEST] : (state) => ({
    ...state,
    userLoading: true,
  }),
  [RIDER_USER_SUCCESS]: (state, action) => ({
    ...state,
    users: action.data,
    selectedRowKeys: [],
    userLoading: false,
  }),
  [RIDER_USER_FAILURE]: (state) => ({
    ...state,
    user: {},
    userLoading: false,
  }),
  [RIDER_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [RIDER_SUCCESS]: (state, action) => ({
    ...state,
    loading: false,
    data: action.data.list,
    page: {
      pageSize: action.data.pageSize,
      pageNo: action.data.pageNo,
      total: action.data.total,
    },
  }),
  [RIDER_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [RIDER_RECORD_CHANGE]: (state, action) => ({
    ...state,
    record: action.fields,
  }),
  [RIDER_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: action.fields,
  }),
  [RIDER_SEARCH_RESET]: (state) => ({
    ...state,
    searchParams: {
      riderName: {
        value: '',
      },
      riderId: {
        value: '',
      },
      riderPhone: {
        value: '',
      },
    },
  }),
  [RIDER_SAVE_REQUEST] : (state) => ({
    ...state,
    confirmLoading: true,
  }),
  [RIDER_SAVE_SUCCESS]: (state) => {
    message.success('操作成功');
    return {
      ...state,
      confirmLoading: false,
      visible: false,
    };
  },
  [RIDER_SAVE_FAILURE]: (state) => ({
    ...state,
    confirmLoading: false,
  }),
  [RIDER_ROW_SELECT]: (state, action) => ({
    ...state,
    record: action.record,
    selectedRowKeys: [action.record.riderId],
  }),
  [RIDER_UNBOUND_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [RIDER_UNBOUND_SUCCESS]: (state) => {
    message.success('解绑成功');
    return {
      ...state,
      loading: false,
    };
  },
  [RIDER_UNBOUND_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  visible: false,
  name: '骑手',
  title: '骑手管理',
  searchParams: {
    riderName: {
      value: '',
    },
    riderId: {
      value: '',
    },
    riderPhone: {
      value: '',
    },
  },
  users: [],
  record: {},
  selectedRowKeys: [],
  bindStatusDict: {
    SUCCESS: '绑定成功',
    REJECT: '绑定失败',
    NOOPERATE: '未绑定',
    UNBUNDLE: '已解绑',
  },
  loading: false,
  page: {
    pageSize: 10,
    pageNo: 1,
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
