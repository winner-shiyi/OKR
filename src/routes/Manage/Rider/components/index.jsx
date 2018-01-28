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
      label: '骑手名称',
      name: 'riderName',
    },
  ];

  const fields = [
    {
      label: '骑手手机号',
      name: 'riderPhone',
      type: 'search',
      onSearch: (value) => (searchUser({ riderPhone: value })),
      required: true,
      phone: true,
    },
    {
      label: '骑手ID',
      name: 'riderId',
      hidden: true,
    },
  ];
  const columns = [
    {
      name: 'riderId',
      label: '骑手ID',
      search: true,
    }, {
      name: 'riderName',
      label: '骑手姓名',
      search: true,
    }, {
      name: 'riderPhone',
      label: '联系电话',
      search: true,
      max: 11,
    }, {
      name: 'idCardNo',
      label: '身份证号',
    }, {
      name: 'bindStatus',
      label: '绑定状态',
      search: true,
      type: 'select',
      data: bindStatusDict,
    }, {
      name: 'enterTime',
      label: '骑手端操作时间',
      type: 'datetime',
    }, {
      name: 'unbundleTime',
      label: '解绑时间',
      type: 'datetime',
    }, {
      name: 'action',
      label: '操作',
      render: (text, rec) => (
        <span>
          {
            rec.bindStatus === 'SUCCESS' && <Button
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: '确定要解除绑定吗？',
                  onOk: () => {
                    unbound({ riderId: rec.riderId });
                  },
                  onCancel() {},
                });
              }}
            >解绑</Button>
          }
          {
            rec.bindStatus === 'NOOPERATE' && <Button
              type="secondary"
              onClick={() => {
                save({ riderId: rec.riderId });
              }}
            >再次发起</Button>
          }
        </span>
      ),
    },
  ];
  const formChildren = (<Table
    rowKey="riderId"
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
      rowKey="riderId"
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
