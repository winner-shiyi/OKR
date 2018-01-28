import React, { Component } from 'react';
import { Layout } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import SideMenu from '../../components/SideMenu';
import './CoreLayout.scss';
import ChangePwdFormWrapper from './PwdForm';
import TopMenuWrapper from './TopMenu';
import respond from '../../decorators/Responsive';

const { Content, Sider } = Layout;

class CoreLayout extends Component {
  state = {
    collapsed: false,
  };
  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
    });
  }
  render() {
    const {
      editPwdVisible,
      expand,
    } = this.props;
    return (
      <Layout>
        {
          editPwdVisible && <ChangePwdFormWrapper />
        }
        <Sider
          collapsible
          collapsedWidth={expand ? 64 : 0}
          breakpoint="sm"
          width={200}
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <layout className="flex flex-v" style={{ height: '100%', borderRight: '1px solid #ececec' }}>
            <div className="logo-wrapper flex flex-v flex-c">
              <div className="logo"><img alt="" src="/logo.png" /></div>
              <div className="logo-title">兔波波骑手驿站</div>
            </div>
            <SideMenu
              collapsed={this.state.collapsed}
            />
          </layout>
        </Sider>
        <Layout>
          <TopMenuWrapper />
          <Scrollbars
            style={{ height: document.body.clientHeight - 64 }}
          >
            <Content style={{ padding: 0, margin: 0 }}>
              {this.props.children}
            </Content>
          </Scrollbars>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  editPwdVisible: state.common.editPwdVisible,
});

export default connect(mapStateToProps)(respond(CoreLayout));
