import { message } from 'antd';
import fetch from '@f12/fetch';
import { createAction } from '../../../util';

const CryptoJS = require('../../../../lib/crypto-js');
// ------------------------------------
// Constants
// ------------------------------------
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGIN_TOGGLE = 'LOGIN_TOGGLE';
const LOGIN_CODE_REQUEST = 'LOGIN_CODE_REQUEST';
const LOGIN_CODE_SUCCESS = 'LOGIN_CODE_SUCCESS';
const LOGIN_CODE_FAILURE = 'LOGIN_CODE_FAILURE';
const LOGIN_FINDPWD_REQUEST = 'LOGIN_FINDPWD_REQUEST';
const LOGIN_FINDPWD_SUCCESS = 'LOGIN_FINDPWD_SUCCESS';
const LOGIN_FINDPWD_FAILURE = 'LOGIN_FINDPWD_FAILURE';
const LOGIN_FORM = 'LOGIN_FORM';
const LOGIN_CHANGE_PHONE = 'LOGIN_CHANGE_PHONE';

// ------------------------------------
// Actions
// ------------------------------------
const loginRequest = (params) => ({
  type: LOGIN_REQUEST,
  payload: params,
});

const loginSuccess = (data) => ({
  type: LOGIN_SUCCESS,
  payload: data,
});

const loginFailure = (msg) => ({
  type: LOGIN_FAILURE,
  payload: msg,
});

const key = CryptoJS.enc.Latin1.parse('eGluZ3Vhbmd4Yw==');
const iv = CryptoJS.enc.Latin1.parse('voskplutwrfnnpuk');

const login = (params) => (dispatch) => {
  const newParams = {
    ...params,
  };
  dispatch(loginRequest(newParams));
  const encrypted = CryptoJS.AES.encrypt(
    newParams.password,
    key,
    {
      iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
    });
  newParams.password = encrypted.toString();
  return fetch('/user/login', newParams)
    .then((json) => {
      if (json.resultCode === '0') {
        dispatch(loginSuccess(json.resultData));
        return true;
      }
      dispatch(loginFailure(json.resultDesc));
      return undefined;
    });
};

export const actions = {
  login,
  toggle: createAction(LOGIN_TOGGLE),
  getForm: createAction(LOGIN_FORM, 'form'),
  changePhone: createAction(LOGIN_CHANGE_PHONE, 'phone'),
  sendCode: (params) => ({
    types: [LOGIN_CODE_REQUEST, LOGIN_CODE_SUCCESS, LOGIN_CODE_FAILURE],
    callAPI: () => fetch('/sms/send', params),
  }),
  findPwd: (params) => {
    const newParams = {
      ...params,
    };
    const encrypted = CryptoJS.AES.encrypt(
      newParams.password,
      key,
      {
        iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
      });
    newParams.password = encrypted.toString();
    return {
      types: [LOGIN_FINDPWD_REQUEST, LOGIN_FINDPWD_SUCCESS, LOGIN_FINDPWD_FAILURE],
      callAPI: () => fetch('/user/findpwd', newParams),
      callback: (payload, dispatch, state) => {
        if (payload.success) {
          state.SignIn.form.setFieldsValue({ username: newParams.phone });
        }
      },
    };
  },
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_REQUEST]: (state, action) => ({
    ...state,
    username: action.payload.username,
    password: action.payload.password,
    loading: true,
  }),
  [LOGIN_SUCCESS]: (state, action) => {
    const user = {
      firstLogin: action.payload.firstLogin,
      phone: action.payload.phone,
      name: action.payload.name,
    };
    localStorage.setItem('accessToken', action.payload.token);
    localStorage.setItem('user', JSON.stringify(user));
    return {
      ...state,
      user: action.payload.user,
      loading: false,
      showLogin: false,
    };
  },
  [LOGIN_FAILURE]: (state, action) => {
    localStorage.setItem('accessToken', '');
    message.error(action.payload);
    return {
      ...state,
      user: '',
      username: '',
      password: '',
      loading: false,
    };
  },
  [LOGIN_FINDPWD_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [LOGIN_FINDPWD_SUCCESS]: (state) => {
    message.success('重置密码成功');
    return {
      ...state,
      loading: false,
      isLogin: true,
    };
  },
  [LOGIN_FINDPWD_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [LOGIN_CODE_FAILURE]: (state) => ({
    ...state,
  }),
  [LOGIN_TOGGLE]: (state) => ({
    ...state,
    isLogin: !state.isLogin,
  }),
  [LOGIN_FORM]: (state, action) => ({
    ...state,
    form: action.form,
  }),
  [LOGIN_CHANGE_PHONE]: (state, action) => ({
    ...state,
    username: action.phone,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  detail: true,
  username: '',
  password: '',
  user: '',
  loading: false,
  isLogin: true,
  showLogin: true,
  form: '',
};
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
