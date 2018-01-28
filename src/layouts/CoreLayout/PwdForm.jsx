import React, { Component } from 'react';
import { Modal, Button, Row, Col, Form } from 'antd';
import { connect } from 'react-redux';
import { createFormItem } from 'local-components';
import './CoreLayout.scss';
import { common } from '../../store/common';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

class PwdForm extends Component {
  componentDidMount() {
    this.props.form.validateFields();
  }

  onCancel() {
    this.props.hideEditPwd();
    this.props.form.resetFields();
  }

  save() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.savePwd(values).then((isSuccess) => {
          if (isSuccess) {
            const user = JSON.parse(localStorage.getItem('user'));
            user.firstLogin = false;
            localStorage.setItem('user', JSON.stringify(user));
            this.props.afterSave && this.props.afterSave();
          }
        });
      }
    });
  }

  render() {
    const {
      form,
      savePwdLoading,
      password,
    } = this.props;

    const user = JSON.parse(localStorage.getItem('user'));
    const firstLogin = user && user.firstLogin;
    const { getFieldsError } = form;

    const fields = [{
      label: '原密码',
      name: 'oldPwd',
      type: 'password',
      required: true,
      hidden: !!password,
      initialValue: password,
      min: 8,
      max: 20,
    }, {
      label: '新密码(8~20)位',
      name: 'newPwd',
      type: 'password',
      required: true,
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
    }, {
      label: '再次输入',
      placeholder: '请再次输入',
      name: 'pwdConfirm',
      type: 'password',
      required: true,
      requiredMsg: '请再次输入',
      min: 8,
      max: 20,
      validator: (rule, value, cbk) => {
        if (value && value !== form.getFieldValue('newPwd')) {
          cbk('两次密码输入不一致');
        } else {
          cbk();
        }
      },
    }];

    return (
      <Modal
        visible={this.props.editPwdVisible}
        className="tbb"
        title={null}
        closable={!firstLogin}
        onCancel={this.onCancel.bind(this)}
        footer={null}
        maskClosable={false}
      >
        <div>
          <div className="form-logo-wrapper flex flex-c">
            <div className="form-logo"><img alt="" src="/logo.png" /></div>
            <div className="form-logo-text">为了您的帐号安全，请修改密码</div>
          </div>
          <Form layout="horizontal">
            <Row>
              {
                fields.map((item) => (
                  createFormItem({
                    field: item,
                    form,
                    validateDisabled: true,
                    formItemLayout: {
                      labelCol: {
                        span: 0,
                      },
                      wrapperCol: {
                        span: 24,
                      },
                    },
                  })
                ))
              }
            </Row>
            <Row>
              <Col>
                <Button
                  onClick={this.save.bind(this)}
                  type="primary"
                  size="large"
                  loading={savePwdLoading}
                  className="form-btn"
                  disabled={hasErrors(getFieldsError())}
                >
                  确定
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  editPwdVisible: state.common.editPwdVisible,
  savePwdLoading: state.common.savePwdLoading,
  password: state.common.password,
});

const mapDispatchToProps = {
  showEditPwd: common.showEditPwd,
  hideEditPwd: common.hideEditPwd,
  savePwd: common.savePwd,
  initCommon: common.initCommon,
};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(PwdForm));
