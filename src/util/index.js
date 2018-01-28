import config from '../config.json';

/*
* get url prefix according to the env, default development
* */

export const getEnv = () => {
  let env = 'development';
  if (__ONLINE__) {
    env = 'online';
  } else if (__PRE__) {
    env = 'pre';
  } else if (__QAIF__) {
    env = 'qaif';
  } else if (__QAFC__) {
    env = 'qafc';
  } else if (__DEV__) {
    env = 'dev';
  } else if (__DEVELOPMENT__) {
    env = 'development';
  }
  return env;
};

export const getBaseUrl = () => {
  const address = config.apiAddress;
  if (__MOCK__) {
    return address.mock;
  }
  return address[getEnv()];
};

export const getCountlyAppKey = () => {
  const countly = config.countly;
  return countly.appKey[getEnv()];
};

export function createAction(type, ...argNames) {
  return function ca(...args) {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
}

export function formatMoney(num) {
  const numStr = `${num}`;
  const nums = numStr.split('.');

  const integer = (nums[0]).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return nums.length > 1 ? `${integer}.${nums[1]}` : integer;
}

export function formatNumber(x) {
  let f = parseFloat(x);
  if (isNaN(f)) {
    return '-';
  }
  f = Math.round(x * 100) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}
