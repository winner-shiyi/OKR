import 'whatwg-fetch';
import { getBaseUrl } from '../util';

const isField = (val) => (typeof val === 'object') && !(val instanceof Array) && 'value' in val && !(val._d);

const shapeType = (param, key) => {
  const value = param.value;
  const res = {};
  switch (param.type) {
    case 'month':
      res[key] = param.format('YYYY-MM');
      break;
    case 'datetimeRange':
    case 'numberRange':
      res[`${key}Start`] = value[0] ? value[0].valueOf() : undefined;
      res[`${key}End`] = value[1] ? value[1].valueOf() : undefined;
      break;
    case 'dateRange':
      res[`${key}Start`] = value[0].format('YYYY-MM-DD 00:00:00');
      res[`${key}End`] = value[1].format('YYYY-MM-DD 23:59:59');
      break;
    case 'monthRange':
      res[`${key}Start`] = value[0].format('YYYY-MM');
      res[`${key}End`] = value[1].format('YYYY-MM');
      break;
    default:
      res[key] = param.value;
      (typeof res[key] === 'string') && res[key].trim();
  }
  return res;
};

const decorateParams = (params = {}) => { // compatible with the param like "foo: {value: 'xxx', ...}"
  let res = {};
  const keys = Object.keys(params);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const param = params[key];
    if (isField(param)) {
      const valueObj = shapeType(param, key);
      res = {
        ...res,
        ...valueObj,
      };
    } else {
      res[key] = param;
    }
  }
  return res;
};

export default (url, params = {}, opts = {}) => {
  const defaultOpts = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${localStorage.getItem('accessToken')}` || 'bearer',
    },
  };

  const newOpts = {
    ...defaultOpts,
    ...opts,
  };

  if (newOpts.method === 'POST') {
    newOpts.body = JSON.stringify(decorateParams(params));
  }
  document.querySelector('#overlay').style.display = 'block';
  return fetch(url.indexOf('//') > -1 ? url : (getBaseUrl() + url), newOpts)
    .then((res) => {
      document.querySelector('#overlay').style.display = 'none';
      if (res.status < 200 || res.status >= 300) {
        return {
          resultCode: '-1',
          resultDesc: `${res.status} ${res.statusText}`,
        };
      }
      const contentType = res.headers.get('content-type');
      if (contentType.indexOf('application/json') > -1) {
        return res.json();
      }
      return res.blob();
    })
    .then((json) => {
      if (json.type) { // blob
        return json;
      }
      if (json.resultCode === '10102') { // 登录过期或未登录
        localStorage.setItem('accessToken', '');
        localStorage.setItem('user', '{}');
        location.assign('/SignIn');
      }
      return json;
    })
    .catch(() => {
      document.querySelector('#overlay').style.display = 'none';
      return {
        resultCode: '-1',
        resultDesc: '网络异常，请重试',
      };
    });
};
