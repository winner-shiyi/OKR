import moment from 'moment';
import 'moment/locale/zh-cn';
import fetch from '@f12/fetch';
import { createAction } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const ORDER_REQUEST = 'ORDER_REQUEST';
const ORDER_SUCCESS = 'ORDER_SUCCESS';
const ORDER_FAILURE = 'ORDER_FAILURE';
const ORDER_SEARCH_CHANGE = 'ORDER_SEARCH_CHANGE';
const ORDER_STATS_REQUEST = 'ORDER_STATS_REQUEST';
const ORDER_STATS_SUCCESS = 'ORDER_STATS_SUCCESS';
const ORDER_STATS_FAILURE = 'ORDER_STATS_FAILURE';
const ORDER_SEARCH_RESET = 'ORDER_SEARCH_RESET';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [ORDER_REQUEST, ORDER_SUCCESS, ORDER_FAILURE],
    callAPI: () => {
      const shapeParams = {
        ...params,
      };
      if ('columnKey' in shapeParams) {
        shapeParams[`${shapeParams.columnKey}Sort`] = shapeParams.order.slice(0, shapeParams.order.length - 3);
        delete shapeParams.columnKey;
        delete shapeParams.order;
      }
      return fetch('/order/list', shapeParams);
    },
    payload: params,
    callback: (payload, dispatch) => {
      if (payload.success) {
        dispatch(actions.loadStats());
      }
    },
  }),
  loadStats: (params) => ({
    types: [ORDER_STATS_REQUEST, ORDER_STATS_SUCCESS, ORDER_STATS_FAILURE],
    callAPI: () => fetch('/order/status/stats', params),
    payload: params,
  }),
  changeSearch: createAction(ORDER_SEARCH_CHANGE, 'field'),
  resetSearch: createAction(ORDER_SEARCH_RESET),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ORDER_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [ORDER_SUCCESS]: (state, action) => ({
    ...state,
    loading: false,
    data: action.data.list,
    page: {
      pageSize: action.data.pageSize,
      pageNo: action.data.pageNo,
      total: action.data.total,
    },
    sorter: {
      columnKey: action.columnKey,
      order: action.order,
    },
  }),
  [ORDER_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [ORDER_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: action.field,
  }),
  [ORDER_STATS_REQUEST] : (state) => ({
    ...state,
    statsLoading: true,
  }),
  [ORDER_STATS_SUCCESS]: (state, action) => ({
    ...state,
    statsLoading: false,
    statsData: action.data,
    now: moment().format('YYYY-MM-DD HH:mm'),
  }),
  [ORDER_STATS_FAILURE]: (state) => ({
    ...state,
    statsLoading: false,
  }),
  [ORDER_SEARCH_RESET]: (state) => ({
    ...state,
    searchParams: {},
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  statsLoading: false,
  title: '任务大厅',
  status: {
    WAITING_GRAB: '待接单',
    WAITING_PICK: '待取货',
    DELIVERYING: '配送中',
    FINISH: '已送达',
    UNDELIVERED: '未妥投',
    CONFIRM: '已确认',
    CANCEL: '已取消',
    RESEND: '已重发',
  },
  overTimeStatus: {
    overtime: '超时',
    no_overtime: '未超时',
  },
  cancelReason: {
    GRAB_OVERTIME: '超时未接单自动取消',
    GRAB_MERCHANT: '商家取消',
    PAY_OVERTIME: '支付超时取消',
    ADMIN_CANCEL: '后台取消',
    RIDER_CANCEL: '骑手主动取消',
    PAY_MERCHANT: '未支付商家取消',
    LEGWORK_CANCEL: '兔快送取消',
  },
  noDeliveredReason: {
    CUSTOMER_DENEY: '用户拒收',
    CUSTOMER_CONTACT_DEFEAT: '联系不到收货人',
    CUSTOMER_ADDRESS_ERROR: '收货地址错误',
    RIDER_DENEY: '骑手有事主动取消',
    OTHER_DENEY: '其他',
  },
  searchParams: {
    orderTime: {
      type: 'datetimeRange',
      value: [moment(moment().format('YYYY-MM-DD 00:00:00')),
        moment(moment().add(1, 'days').format('YYYY-MM-DD 00:00:00'))],
    },
    orderStatus: {
      type: 'select',
      value: 'WAITING_GRAB',
    },
  },
  page: {
    pageSize: 10,
    pageNo: 1,
  },
  sorter: {
    columnKey: 'orderTime',
    order: 'descend',
  },
  now: moment().format('YYYY-MM-DD HH:mm'),
  statsData: {
    waitingGrabCounts: 0,
    deliveryingCounts: 0,
    progressCounts: 0,
    undeliveredCounts: 0,
    waitingPickCounts: 0,
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
