import React, { useState, useContext } from 'react';
import 'antd/dist/antd.css';
import './signup.css';
import axios from 'axios';
import { Form, Input, Checkbox, Button, Row, Col } from 'antd';
import Header from './Header';
import { UserContext } from '../contexts';
export default function Signup() {
  const { user, setUser } = useContext(UserContext);

  const [userDetails, setuserDetails] = useState({
    name: '',
    email: '',
    mobile: null,
    password: '',
    confirmPassword: '',
    contact1: null,
    contact2: null,
    contact3: null,
    contact4: null,
    contact5: null,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('clicked');
    const res = await axios.post(
      '/api/users/signup',
      {
        name: userDetails.name,
        phone_no: userDetails.mobile,
        email: userDetails.email,
        password: userDetails.password,
        passwordConfirm: userDetails.confirmPassword,
        contact_info: [
          userDetails.contact1,
          userDetails.contact2,
          userDetails.contact3,
          userDetails.contact4,
          userDetails.contact5,
        ],
      },
      {
        withCredentials: true,
      }
    );
    setUser(res.data.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.data.user));
    console.log(res.data);
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
          <h2>Sign Up</h2>
          <form onSubmit={onSubmit} method="POST">
            <Row>
              <Col xs={8}>
                <span className="form-fields required">Name</span>
              </Col>
              <Col xs={15}>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  maxlength="25"
                  value={userDetails.name}
                  onChange={changeHandler}
                />
              </Col>
            </Row>
            <br />
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
                <span className="form-fields required">Mobile </span>
              </Col>
              <Col xs={15}>
                <input
                  className="form-control"
                  // type="text"
                  name="mobile"
                  value={userDetails.mobile}
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
            <Row>
              <Col xs={8}>
                <span className="form-fields required">Confirm Password </span>
              </Col>
              <Col xs={15}>
                <input
                  className="form-control"
                  type="password"
                  name="confirmPassword"
                  value={userDetails.confirmPassword}
                  onChange={changeHandler}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={8}>
                <span className="form-fields required">Contact Numbers 1.</span>
              </Col>
              <Col xs={15}>
                <input
                  className="form-control"
                  type="text"
                  name="contact1"
                  value={userDetails.contact1}
                  onChange={changeHandler}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={8}>
                <span className="form-fields">2.</span>
              </Col>
              <Col xs={15}>
                <input
                  className="form-control"
                  type="text"
                  name="contact2"
                  value={userDetails.contact2}
                  onChange={changeHandler}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={8}>
                <span className="form-fields">3.</span>
              </Col>
              <Col xs={15}>
                <input
                  className="form-control"
                  type="text"
                  name="contact3"
                  value={userDetails.contact3}
                  onChange={changeHandler}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={8}>
                <span className="form-fields">4.</span>
              </Col>
              <Col xs={15}>
                <input
                  className="form-control"
                  type="text"
                  name="contact4"
                  value={userDetails.contact4}
                  onChange={changeHandler}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={8}>
                <span className="form-fields">5.</span>
              </Col>
              <Col xs={15}>
                <input
                  className="form-control"
                  type="text"
                  name="contact5"
                  value={userDetails.contact5}
                  onChange={changeHandler}
                />
              </Col>
            </Row>
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
