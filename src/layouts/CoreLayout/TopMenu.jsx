import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Button } from 'antd';
import { connect } from 'react-redux';
import { common } from '../../store/common';
import { getTopMenus } from '../../selectors';
import DropdownPanelWrapper from './DropdownPanel';
import respond from '../../decorators/Responsive';

const { Header } = Layout;

class TopMenu extends Component {
  onClick({ key }) {
    this.props.clickTopMenu(key);
  }

  createMenu = (data) => data.map((item) => <Menu.Item key={item.id}><a>{item.name}</a></Menu.Item>)

  render() {
    const {
      expand,
    } = this.props;
    const menu = (
      <Menu
        mode={expand ? 'horizontal' : 'vertical'}
        selectedKeys={this.props.selectedKeys}
        style={{ lineHeight: '64px' }}
        onClick={this.onClick.bind(this)}
      >
        {this.createMenu(this.props.topMenuData)}
      </Menu>
    );
    return (
      <Header className="header flex flex-c flex-js">
        {
          !expand && <Dropdown overlay={menu} trigger={['click']}>
            <Button icon="bars" />
          </Dropdown>
        }
        {
          expand && menu
        }
        <DropdownPanelWrapper />
      </Header>
    );
  }
}

const TopMenuWrapper = connect((state) => ({
  topMenuData: getTopMenus(state),
  selectedKeys: state.common.selectedTopKeys,
  firstLeaf: state.common.firstLeaf,
}), {
  clickTopMenu: common.clickTopMenu,
  initMenu: common.initMenu,
})(TopMenu);

export default respond(TopMenuWrapper);
