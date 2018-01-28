import React from 'react';
import { Button, Modal } from 'antd';
import { Table, ListPage } from 'local-components';
import ModalForm from '../../../../components/ModalForm';
import list from '../../../../decorators/list';

const View = (props) => {
  const {
    open,
    searchUser,
    selectedRowKeys = [],
    selectRow,
    users,
    bindStatusDict,
    unbound,
    visible,
    record,
    confirmDisabled,
    save,
    changeRecord,
    confirmLoading,
    close,
    name,
  } = props;

  const buttons = [
    {
      label: '新增',
      onClick: () => {
        open();
      },
    },
  ];

  const userColumns = [
    {
      label: '商家名称',
      name: 'shopName',
    },
  ];

  const fields = [
    {
      label: '商家手机号',
      name: 'shopPhone',
      type: 'search',
      onSearch: (value) => (searchUser({ shopPhone: value })),
      required: true,
      phone: true,
    },
    {
      label: '商家ID',
      name: 'shopId',
      hidden: true,
    },
  ];
  const columns = [
    {
      name: 'shopId',
      label: '商家ID',
      search: true,
    }, {
      name: 'shopName',
      label: '商家名称',
      search: true,
    }, {
      name: 'address',
      label: '详细地址',
    }, {
      name: 'shopPhone',
      label: '联系电话',
      search: true,
      max: 11,
    }, {
      name: 'bindStatus',
      label: '绑定状态',
      search: true,
      type: 'select',
      data: bindStatusDict,
    }, {
      name: 'enterTime',
      label: '商家端操作时间',
      type: 'datetime',
    }, {
      name: 'unbundleTime',
      label: '解绑时间',
      type: 'datetime',
    }, {
      name: 'action',
      label: '操作',
      render: (text, rec) => (
        rec.bindStatus === 'SUCCESS' && <Button
          type="primary"
          onClick={() => {
            Modal.confirm({
              title: '确定要解除绑定吗？',
              onOk: () => {
                unbound({ shopId: rec.shopId });
              },
              onCancel() {},
            });
          }}
        >解绑</Button>
      ),
    },
  ];
  const formChildren = (<Table
    rowKey="shopId"
    columns={userColumns}
    dataSource={users}
    size="small"
    pagination={null}
    yScroll={93}
    radio={{
      selectedRowKeys,
      selectRow,
    }}
  />);

  return (
    <ListPage
      {...props}
      rowKey="shopId"
      buttons={buttons}
      columns={columns}
    >
      <ModalForm
        visible={visible}
        fields={fields}
        values={record}
        confirmDisabled={confirmDisabled}
        confirmLoading={confirmLoading}
        onCreate={save}
        title={name}
        formWidth={520}
        changeRecord={changeRecord}
        onCancel={close}
      >
        {formChildren}
      </ModalForm>
    </ListPage>
  );
};

export default list(View);
