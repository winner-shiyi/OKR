// import { Row, Col, Spin } from 'antd';
import React, { Component } from 'react';
import echarts from 'echarts';
import flare from './flare';
import './style.scss';

class View extends Component {
  componentDidMount() {
    const myChart = echarts.init(document.getElementById('main'));
    const data = flare;
    echarts.util.each((data.children), (item, index) => {
      const itemTemp = item;
      index % 2 === 0 && (itemTemp.collapsed = true);
      return true;
    });
    // const json = {
    //   series: [{
    //     type: 'tree',
    //     data: [{
    //       name: '中国',
    //       // label: {
    //       //   normal: {
    //       //     backgroundColor: '#725bb8',
    //       //   },
    //       // },
    //       children: [{
    //         name: '黑龙江',
    //         children: [{
    //           name: '哈尔滨',
    //           value: 1200,
    //         }, {
    //           name: '大庆',
    //           value: 1500,
    //         }],
    //       }, {
    //         name: '广东',
    //         children: [{
    //           name: '广州',
    //           children: [{
    //             name: '越秀区',
    //             value: 450,
    //           }, {
    //             name: '白云区',
    //             value: 640,
    //           }],
    //         }, {
    //           name: '深圳',
    //           value: 3600,
    //         }, {
    //           name: '珠海',
    //           value: 2700,
    //         }],
    //       }, {
    //         name: '台湾',
    //         children: [{
    //           name: '台北',
    //           value: 800,
    //         }, {
    //           name: '高雄',
    //           value: 600,
    //         }],
    //       }, {
    //         name: '新疆',
    //         children: [{
    //           name: '乌鲁木齐',
    //           value: 300,
    //         }],
    //       }],
    //     }],
    //     // 设置边看等属性
    //     itemStyle: {
    //       normal: {
    //         color: 'green',
    //         borderWidth: 10,
    //       },
    //     },
    //     // 内容位置等属性
    //     label: {
    //       normal: {
    //         position: 'center',
    //         verticalAlign: 'middle',
    //         align: 'left',
    //         backgroundColor: '#7049f0',
    //         color: '#fff',
    //         padding: 3,
    //         formatter: [
    //           '{box|{b}}',
    //         ].join('\n'),
    //         rich: {
    //           box: {
    //             height: 60,
    //             color: '#fff',
    //             padding: [0, 5],
    //             align: 'center',
    //           },
    //         },
    //       },
    //     },
    //     //
    //     leaves: {
    //       label: {
    //         normal: {
    //           position: 'center',
    //           verticalAlign: 'middle',
    //           align: 'left',
    //           backgroundColor: '#c44eff',
    //           formatter: [
    //             '{box|{b}}',
    //           ].join('\n'),
    //           rich: {
    //             box: {
    //               height: 18,
    //               color: '#fff',
    //               padding: [0, 5],
    //               align: 'center',
    //             },
    //           },
    //         },
    //       },
    //     },
    //     // 连线颜色属性
    //     lineStyle: {
    //       normal: {
    //         color: '#000',
    //         width: 1.5,
    //       },
    //     },
    //     top: '20%',
    //     left: '7%',
    //     bottom: '20%',
    //     right: '20%',
    //     symbolSize: [50, 50], // 终点标记的大小

    //     expandAndCollapse: true,
    //     animationDuration: 550,
    //     animationDurationUpdate: 750,
    //     // orient: 'vertical',
    //     symbol: 'roundRect',
    //     // 设置边看等属性
    //     itemStyle: {
    //       normal: {
    //         color: 'green',
    //         borderWidth: 10,
    //       },
    //     },
    //     // 内容位置等属性
    //     label: {
    //       normal: {
    //         position: 'center',
    //         verticalAlign: 'middle',
    //         align: 'left',
    //         backgroundColor: '#7049f0',
    //         color: '#fff',
    //         padding: 3,
    //         formatter: [
    //           '{box|{b}}',
    //         ].join('\n'),
    //         rich: {
    //           box: {
    //             height: 60,
    //             color: '#fff',
    //             padding: [0, 5],
    //             align: 'center',
    //           },
    //         },
    //       },
    //     },
    //   }],
    // };
    const option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
      },
      series: [
        {
          type: 'tree',
          data: [data],
          top: '20%',
          left: '7%',
          bottom: '20%',
          right: '20%',
          // orient: 'vertical', // 垂直
          itemStyle: {
            normal: {
              color: 'green',
              borderWidth: 1,
            },
          },

          symbol: 'roundRect',
          symbolSize: [50, 50],
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
        },
      ],
    };

    myChart.setOption(option);
  }
  render() {
    return (
      <div id="main" style={{ width: '800px', height: '1000px' }}>aaa</div>
    );
  }
}

export default View;
