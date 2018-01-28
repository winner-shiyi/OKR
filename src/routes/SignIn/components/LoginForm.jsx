import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { Link } from 'react-router';
import { createFormItem } from './index';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnEnabled: undefined,
    };
  }
  componentDidMount() {
    const {
      form,
      username,
    } = this.props;
    form.setFieldsValue({ username });
    this.props.getForm(form);
    // https://stackoverflow.com/questions/35049555/chrome-autofill-autocomplete-no-value-for-password
    setTimeout(() => {
      const pwd = document.getElementById('password');
      pwd.focus();
      pwd.select();
      const noChars = pwd.selectionEnd;
      document.getElementById('username').focus();
      if (noChars > 0) {
        document.getElementById('loginBtn').disabled = false;
      }
    }, 500);
    form.validateFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values);
      }
    });
  }

  render() {
    const {
      toggle,
      form,
      changePhone,
    } = this.props;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = form;
    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <div className="login-form">
        <div className="login-logo-wrapper flex flex-c flex-v">
          <div className="login-logo-text">兔波波骑手驿站</div>
          <div className="login-logo"><img alt="" src="/logo.png" /></div>
        </div>
        <Form onSubmit={this.handleSubmit} className="login-form-inner">
          <FormItem
            validateStatus={usernameError ? 'error' : ''}
            help={usernameError || ''}
          >
            {createFormItem({
              getFieldDecorator,
              required: true,
              icon: 'user',
              type: 'text',
              label: '兔波波用户名',
              name: 'username',
              phone: true,
              max: 50,
              onChange: (e) => {
                changePhone(e.target.value);
              },
            })}
          </FormItem>
          <FormItem
            validateStatus={passwordError ? 'error' : ''}
            help={passwordError || ''}
          >
            {createFormItem({
              getFieldDecorator,
              required: true,
              icon: 'lock',
              type: 'password',
              label: '密码',
              name: 'password',
              min: 8,
              max: 20,
              pattern: /^[0-9a-zA-Z]*$/,
              patternMsg: '，支持数字及英文大小写',
            })}
          </FormItem>
          <FormItem style={{ marginBottom: 0 }}>
            <Button
              id="loginBtn"
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={this.props.loading}
              disabled={hasErrors(getFieldsError())}
            >
              登录
            </Button>
            <div className="login-fp">
              <Link onClick={toggle} className="login-form-forgot">忘记密码</Link>
            </div>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(LoginForm);

