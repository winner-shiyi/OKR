import React, { Component } from 'react';
import { Layout, Input, Icon } from 'antd';
import { browserHistory } from 'react-router';
import { Captcha } from 'local-components';
import LoginForm from './LoginForm';
import FindPwdForm from './FindPwdForm';
import PwdForm from '../../../layouts/CoreLayout/PwdForm';
import './style.scss';

const { Content, Footer } = Layout;

const createInput = (opts) => {
  const label = opts.placeholder || opts.label;
  switch (opts.type) {
    case 'captcha':
      return (
        <Captcha
          placeholder={opts.label}
          onClick={opts.onClick}
          icon={opts.icon}
          form={opts.form}
          onChange={opts.onChange}
          size={opts.size}
        />
      );
    case 'password':
      return (
        <Input
          prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />}
          type={opts.type}
          placeholder={label}
          onChange={opts.onChange}
        />
      );
    default:
      return (
        <Input
          prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />}
          type="text"
          placeholder={label}
          onChange={opts.onChange}
        />
      );
  }
};

export const createFormItem = (opts) => {
  const rules = [];
  const label = opts.label.replace(/\(.*\)/, '');
  if (opts.required) {
    rules.push({ required: true, message: `请输入${label}` });
  }
  if (opts.validator) {
    rules.push({ validator: opts.validator });
  }
  if (opts.length) {
    const [minLength, maxLength] = opts.length;
    rules.push({ validator: (rule, val, cbk) => {
      const value = (val || '').toString();
      if (value && (value.length < minLength || value.length > maxLength)) {
        cbk(`${label}为${minLength}~${maxLength}位`);
      }
      cbk();
    } });
  }
  if (opts.max) {
    rules.push({ max: opts.max, message: `${label}最大为${opts.max}位` });
  }
  if (opts.min) {
    rules.push({ min: opts.min, message: `${label}最小为${opts.min}位` });
  }
  if (opts.number) {
    rules.push({ pattern: /^\d+$/, message: '请输入数字' });
  }
  if (opts.pattern) {
    rules.push({ pattern: opts.pattern, message: opts.patternMsg });
  }
  if (opts.phone) {
    rules.push({ pattern: /^1[34578][0-9]{9}$/, message: '请输入正确的手机格式' });
  }
  return opts.getFieldDecorator(opts.name, {
    rules,
  })(createInput(opts));
};

class View extends Component {
  componentDidMount() {
  }

  login(values) {
    this.props.login(values).then((isSuccess) => {
      if (isSuccess) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.firstLogin) {
          this.props.showEditPwd(this.props.password);
        } else {
          browserHistory.push('/Manage');
        }
      }
    });
  }

  render() {
    const {
      isLogin,
      loading,
      toggle,
      sendCode,
      findPwd,
      showLogin,
      editPwdVisible,
      getForm,
      changePhone,
      username,
    } = this.props;

    return (
      <div className="login-bg">
        {
          editPwdVisible &&
          <PwdForm
            afterSave={() => { browserHistory.push('/Manage'); }}
          />
        }
        <Layout className="login-layout">
          <Content className="login-content">
            {
              showLogin && isLogin &&
              (
                <LoginForm
                  key="loginForm"
                  login={this.login.bind(this)}
                  loading={loading}
                  toggle={toggle}
                  getForm={getForm}
                  changePhone={changePhone}
                  username={username}
                />
              )
            }
            {
              showLogin && !isLogin &&
              (
                <FindPwdForm
                  key="findPwdForm"
                  findPwd={findPwd.bind(this)}
                  loading={loading}
                  toggle={toggle}
                  code={sendCode}
                  changePhone={changePhone}
                  username={username}
                />
              )
            }
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            copyright © 浙江兔巢科技产业互联技术中心
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default View;
