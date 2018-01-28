import React from 'react';
import {
  Form,
  Input,
  Modal,
  Row,
  Col,
  Button,
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { createFormItem, mapPropsToFields, onFieldsChange } from 'local-components';

const FormItem = Form.Item;

const ModalForm = Form.create({
  mapPropsToFields,
  onFieldsChange,
})(
  (props) => {
    const {
      visible,
      onCancel,
      onCreate,
      title,
      fields,
      form,
      formWidth,
      cusTitle,
      children,
      confirmDisabled,
      confirmLoading } = props;
    const { getFieldDecorator, validateFields } = form;
    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
    };

    const save = () => {
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          onCreate(values);
        }
      });
    };

    const isEdit = () => !!(props.values && props.values.id);

    const geneForm = (flds) => (
      <Scrollbars
        autoHeight
        autoHeightMin={100}
        autoHeightMax={550}
      >
        <Form layout="horizontal">
          <FormItem label="" {...formItemLayout} style={{ display: 'none' }}>
            {getFieldDecorator('id', {
            })(
              <Input type="hidden" />
            )}
          </FormItem>
          <Row>
            {
              flds.map((item) => (
                createFormItem({
                  field: item,
                  form,
                  formItemLayout,
                })
              ))
            }
          </Row>
          {
            children && (
              <Row style={{ marginBottom: 24 }}>
                {children}
              </Row>
            )
          }
          <Row>
            <Col>
              <Button
                onClick={save}
                type="primary"
                size="large"
                disabled={confirmDisabled}
                loading={confirmLoading}
                className="form-btn"
              >
                确定
              </Button>
            </Col>
          </Row>
        </Form>
      </Scrollbars>
    );

    return (
      <Modal
        className="tbb"
        width={formWidth || 520}
        visible={visible}
        title={null}
        onCancel={onCancel}
        onOk={save}
        maskClosable={false}
        footer={null}
      >
        <div>
          <div className="form-logo-wrapper flex flex-c">
            <div className="form-logo"><img alt="" src="/logo.png" /></div>
            <div className="form-logo-text">{cusTitle || ((isEdit() ? '修改' : '新增') + title)}</div>
          </div>
          {geneForm(fields)}
        </div>
      </Modal>
    );
  }
);
export default ModalForm;
