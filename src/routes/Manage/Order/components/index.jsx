import { Row, Col, Spin } from 'antd';
import React, { Component } from 'react';
import { ListPage } from 'local-components';
import './style.scss';
import { formatNumber } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.props.load({
      ...this.props.sorter,
      pageSize: this.props.page.pageSize,
      pageNo: this.props.page.pageNo,
      ...this.props.searchParams,
    });
    this.props.loadStats();
  }

  render() {
    const {
      title,
      load,
      changeSearch,
      searchParams,
      data,
      sorter,
      now,
      status,
      page,
      overTimeStatus,
      cancelReason,
      statsData,
      statsLoading,
      noDeliveredReason,
      resetSearch,
    } = this.props;
    const columns = [
      {
        name: 'orderNo',
        label: '订单编号',
        search: true,
        width: 120,
        fixed: 'left',
      }, {
        name: 'orderStatus',
        label: '订单状态',
        type: 'select',
        search: true,
        width: 70,
        render: (text) => (status[text]),
        data: status,
        fixed: 'left',
        required: true,
      }, {
        name: 'shopId',
        label: '商家ID',
        search: true,
        hidden: true,
      }, {
        name: 'shopName',
        label: '商家名称',
        search: true,
      }, {
        name: 'riderId',
        label: '骑手ID',
        search: true,
        hidden: true,
      }, {
        name: 'riderName',
        label: '骑手姓名',
      }, {
        name: 'riderPhone',
        label: '骑手电话',
        width: 90,
      }, {
        name: 'orderTime',
        label: '创建时间',
        type: 'datetimeRange',
        width: 80,
        sorter: true,
        search: true,
        required: true,
        maxInterval: 1296000000,
        validator: (rule, value, callback) => {
          if (!value[0] || !value[1]) {
            callback('请选择创建时间');
          }
          callback();
        },
      }, {
        name: 'expectFinishTime',
        label: '预计送达时间',
        type: 'datetime',
        width: 80,
        sorter: true,
      }, {
        name: 'grabItemTime',
        label: '取货时间',
        type: 'datetime',
        width: 80,
      }, {
        name: 'finishOrderTime',
        label: '送达时间',
        type: 'datetime',
        width: 80,
      }, {
        name: 'overtimeStatus',
        label: '超时状态',
        type: 'select',
        render: (text) => <span style={{ color: text === 'overtime' ? 'red' : '' }}>{overTimeStatus[text]}</span>,
      }, {
        name: 'noDeliveredTime',
        label: '未妥投时间',
        type: 'datetime',
        width: 80,
      }, {
        name: 'noDeliveredReason',
        label: '未妥投原因',
        render: (text) => (noDeliveredReason[text]),
      }, {
        name: 'confirmTime',
        label: '确认时间',
        type: 'datetime',
        width: 80,
      }, {
        name: 'cancelTime',
        label: '取消时间',
        type: 'datetime',
        width: 80,
      }, {
        name: 'cancelReason',
        label: '取消原因',
        render: (text) => (cancelReason[text]),
      }, {
        name: 'amount',
        label: '订单金额(元)',
        render: (text) => formatNumber(text),
      }, {
        name: 'deliveryDistance',
        label: '配送距离(km)',
        render: (text) => formatNumber(text / 1000),
      }, {
        name: 'receiverName',
        label: '收货人姓名',
      }, {
        name: 'receiverPhone',
        label: '收货人电话',
        width: 90,
        max: 11,
      }, {
        name: 'receiverAddress',
        label: '收货人地址',
      },
    ];
    const aboveSearch =
      (<Spin spinning={statsLoading}>
        <div className="listpage-total-wrapper">
          <Row span={24} className="listpage-total-title">更新于{now}</Row>
          <Row span={24}>
            <Col className="listpage-total-item" span={5}>
              <span className="listpage-total-label">进行中:</span>
              <span className="listpage-total-text">{statsData.progressCounts}</span>
            </Col>
            <Col className="listpage-total-item" span={5}>
              <span className="listpage-total-label">待接单:</span>
              <span className="listpage-total-text">{statsData.waitingGrabCounts}</span>
            </Col>
            <Col className="listpage-total-item" span={5}>
              <span className="listpage-total-label">待取货:</span>
              <span className="listpage-total-text">{statsData.waitingPickCounts}</span>
            </Col>
            <Col className="listpage-total-item" span={5}>
              <span className="listpage-total-label">配送中:</span>
              <span className="listpage-total-text">{statsData.deliveryingCounts}</span>
            </Col>
            <Col className="listpage-total-item" span={4}>
              <span className="listpage-total-label">未妥投(未确认):</span>
              <span className="listpage-total-text">{statsData.undeliveredCounts}</span>
            </Col>
          </Row>
        </div>
      </Spin>);

    return (
      <ListPage
        rowKey="orderNo"
        columns={columns}
        title={title}
        search={load}
        changeSearch={changeSearch}
        searchParams={searchParams}
        aboveSearch={aboveSearch}
        data={data}
        sorter={sorter}
        page={page}
        xScroll={1600}
        resetSearch={resetSearch}
      />
    );
  }
}

export default View;
