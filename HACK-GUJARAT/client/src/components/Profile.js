import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Header from './Header';
import './profile.css';
export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  return (
    <div>
      <Header />
      <div className="container1">
        <div id="avatar">
          {' '}
          <Avatar
            style={{ backgroundColor: '#87d068' }}
            icon={<UserOutlined />}
            size={70}
          />
        </div>
        <div className="username">
          <h2>{user.name}</h2>
        </div>
      </div>
      <ul>
        <li>Mob Number: {user.phone_no}</li>
        <li>
          Emergency Numbers:
          <ol>
            {user.contact_info.map((contact) => {
              if (contact)
                return (
                  <li>
                    <input defaultValue={contact} />
                  </li>
                );
            })}
          </ol>
        </li>
      </ul>
    </div>
  );
}
