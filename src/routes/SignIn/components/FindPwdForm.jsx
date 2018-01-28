import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { Link } from 'react-router';
import { createFormItem } from './index';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

class FindPwdForm extends Component {
  componentDidMount() {
    const {
      form,
      username,
    } = this.props;
    form.setFieldsValue({ phone: username });
    form.validateFields();
  }

  onCodeClick = () => {
    const me = this;
    return new Promise(((resolve) => {
      me.props.form.validateFields(['phone'], (err, values) => {
        if (!err) {
          me.props.code({
            ...values,
            type: 'f',
          }).then((isSuccess) => {
            resolve(isSuccess);
          });
        } else {
          resolve(false);
        }
      });
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.findPwd(values);
      }
    });
  }

  createItems = (fields) => fields.map((field) => {
    const { isFieldTouched, getFieldError } = field.form;
    const error = isFieldTouched(field.name) && getFieldError(field.name);
    return (
      <FormItem
        key={field.name}
        validateStatus={error ? 'error' : ''}
        help={error || ''}
      >
        {createFormItem(field)}
      </FormItem>
    );
  })

  render() {
    const {
      toggle,
      form,
      changePhone,
    } = this.props;
    const { getFieldDecorator, getFieldsError } = form;
    const fields = [
      {
        getFieldDecorator,
        required: true,
        icon: 'phone',
        type: 'captcha',
        label: '手机号',
        name: 'phone',
        size: 'large',
        phone: true,
        onClick: this.onCodeClick.bind(this),
        onChange: (e) => {
          changePhone(e.target.value);
        },
        form,
      }, {
        getFieldDecorator,
        required: true,
        icon: 'lock',
        label: '验证码',
        name: 'code',
        max: 6,
        form,
        number: true,
      }, {
        getFieldDecorator,
        required: true,
        icon: 'lock',
        type: 'password',
        label: '新密码(8~20位)',
        name: 'password',
        min: 8,
        max: 20,
        pattern: /^[0-9a-zA-Z]*$/,
        patternMsg: '，支持数字及英文大小写',
        validator: (rule, value, callback) => {
          if (value && form.getFieldValue('pwdConfirm')) {
            form.validateFields(['pwdConfirm'], { force: true });
          }
          callback();
        },
        form,
      }, {
        getFieldDecorator,
        required: true,
        icon: 'lock',
        type: 'password',
        label: '密码确认',
        placeholder: '再次输入',
        name: 'pwdConfirm',
        validator: (rule, value, callback) => {
          if (value && value !== form.getFieldValue('password')) {
            callback('两次密码输入不一致');
          } else {
            callback();
          }
        },
        form,
      },
    ];
    return (
      <div className="login-form">
        <div className="login-logo-wrapper flex flex-c">
          <div className="login-logo"><img alt="" src="/logo.png" /></div>
          <div className="login-logo-text">重置密码</div>
        </div>
        <Form onSubmit={this.handleSubmit} className="login-form-inner">
          {
            this.createItems(fields)
          }
          <FormItem style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={this.props.loading}
              disabled={hasErrors(getFieldsError())}
            >
              重置
            </Button>
            <div className="login-fp">
              <Link onClick={toggle} className="login-form-forgot">返回登录</Link>
            </div>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(FindPwdForm);

