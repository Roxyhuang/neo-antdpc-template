import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import PropTypes from 'prop-types';

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = (props) => {
  const history = props.history || {};
  const tabMap = {
    1: '/list-a',
    2: '/list-b',
    3: '/list-c',
  };
  const handleClick = (item) => {
    history.push(tabMap[item.key]);
  };

  return (
    <div>
      <Header style={{ width: '100%', height: '80px', background: '#0a294a', padding: 0 }} />
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={(item) => { handleClick(item); }}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span className="nav-text">list-a</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span className="nav-text">list-b</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span className="nav-text">list-c</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

Layout.defaultProps = {
  className: '',
  backgroundColor: '',
};

Layout.PropTypes = {
  className: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default MainLayout;
