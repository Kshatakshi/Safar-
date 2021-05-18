import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts';
import { useHistory } from 'react-router-dom';
import './signup.css';
import { Form, Input, Checkbox, Button, Row, Col } from 'antd';
import Header from './Header';
import axios from 'axios';
export default function Login() {
  const { user, setUser } = useContext(UserContext);

  const history = useHistory();

  const [userDetails, setuserDetails] = useState({
    email: '',
    password: '',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      'http://localhost:3000/api/users/login',
      {
        email: userDetails.email,
        password: userDetails.password,
      },
      {
        withCredentials: true,
      }
    );

    setUser(res.data.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.data.user));
    console.log(res.data.data.user);
    history.push('/');
  };

  const changeHandler = (e) => {
    let value = e.target.value.replace(/<[^>]*>?/gm, '');
    setuserDetails({ ...userDetails, [e.target.name]: value });
  };

  return (
    <div>
      <Header />
      <div className="container">
        <center>
          <h2>Login</h2>
          <form onSubmit={onSubmit} method="POST">
            <Row>
              <Col xs={8}>
                <span className="form-fields required">Email </span>
              </Col>
              <Col xs={15}>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={changeHandler}
                />
              </Col>
            </Row>
            <br />

            <Row>
              <Col xs={8}>
                <span className="form-fields required">Password </span>
              </Col>
              <Col xs={15}>
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  value={userDetails.password}
                  onChange={changeHandler}
                />
              </Col>
            </Row>
            <br />

            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </form>
          {/* </Col> */}
        </center>
      </div>
    </div>
  );
}
