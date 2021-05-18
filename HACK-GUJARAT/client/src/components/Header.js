import React, { Component, useContext, useState } from 'react';
import { UserContext } from '../contexts';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { PageHeader, Menu, Button, Drawer } from 'antd';
import {
  HomeOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import "./header.css"
export default function Header() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const open = () => {
    setCollapsed(true);
  };

  const close = () => {
    setCollapsed(false);
  };

  const handleSOS = () => {};

  const logout = async () => {
    const res = await axios.get('api/users/logout', {
      withCredentials: true,
    });
    localStorage.removeItem('user');
    setUser(null);
    console.log(res);
  };

  return (
    <div>
      
      <PageHeader
        className="site-page-header"
        // onBack={() => null}
        title={[<img src="Logo-Design-Inspiration-222.png" alt="Logo"/>]}
        subTitle="Keeps you safe"
        extra={[
          <Button key="1" type="primary" onClick={open}>
            {React.createElement(MenuFoldOutlined)}
          </Button>,
        ]}
      />
      <Drawer
        title={
          user
            ? `Welcome ${user.name}`
            : 'Get authenticated for better experience'
        }
        placement="right"
        closable={false}
        onClose={close}
        visible={collapsed}
      >
        <p>
          {' '}
          <Link to={'/'}>
            <Button type="primary">{React.createElement(HomeOutlined)}</Button>
          </Link>
          {user && (
            <Link to={'/profile'}>
              <Button type="primary">
                {React.createElement(UserOutlined)}
              </Button>
            </Link>
          )}
        </p>
        {!user && (
          <p>
            {' '}
            <Link to={'/signup'}>
              <Button type="primary">Sign Up</Button>
            </Link>
          </p>
        )}
        {!user && (
          <p>
            {' '}
            <Link to={'/login'}>
              <Button type="primary">Login</Button>
            </Link>
          </p>
        )}
        {user && (
          <p>
            {' '}
            <Button type="primary" onClick={logout}>
              Logout
            </Button>
          </p>
        )}
        <p>
          {' '}
          <Link to={'/SOS'}>
            <Button type="primary" onClick={handleSOS}>
              SOS
            </Button>
          </Link>
        </p>
      </Drawer>
    </div>
  );
}
