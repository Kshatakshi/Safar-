import React, { useState, useContext } from 'react';
import { RoadsContext } from '../contexts';
import axios from 'axios';
import { Form, Input, Checkbox, Button, Row, Col } from 'antd';
import './search.css';
import Header from './Header';
export default function Feedback() {
  const { roads, setRoads } = useContext(RoadsContext);

  const [values, setValues] = useState({
    crowd: 0,
    ratio: 0,
    light: 0,
    safety: 0,
  });

  const handleChange = (e) => {
    let value = parseInt(e.target.value.replace(/<[^>]*>?/gm, ''));
    setValues({ ...values, [e.target.name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const feedback = {
      lighting: values.light,
      crowd: values.crowd,
      genderRatio: values.ratio,
      feltSafe: values.safety,
    };
    const res = await axios.post('/api/roads/feedback', {
      roads,
      feedback,
    });

    console.log(res);
  };

  return (
    <div>
      <Header />
      <div className="container2">
        <center>
          <h2>What is your opinion on this path?</h2>
        </center>
        <form onSubmit={onSubmit} method="POST">
          <div className="question">
            <p>How was the crowd?</p>
          </div>
          <div className="options">
            <input
              type="radio"
              name="crowd"
              value="-1"
              onChange={handleChange}
              checked={values.crowd === -1}
              onChange={handleChange}
            />
            <span>Light</span>
            <input
              type="radio"
              name="crowd"
              value="0"
              onChange={handleChange}
              checked={values.crowd === 0}
            />
            <span>Moderate</span>
            <input
              type="radio"
              name="crowd"
              value="1"
              onChange={handleChange}
              checked={values.crowd === 1}
            />
            <span>Busy</span>
          </div>
          <br />
          <div className="question">
            <p>Gender Ratio (F/M) ?</p>
          </div>
          <div className="options">
            <input
              type="radio"
              name="ratio"
              value="-1"
              onChange={handleChange}
              checked={values.ratio === -1}
            />
            <span>Less than 1</span>
            <input
              type="radio"
              name="ratio"
              value="0"
              onChange={handleChange}
              checked={values.ratio === 0}
            />
            <span>Equal to 1</span>
            <input
              type="radio"
              name="ratio"
              value="1"
              onChange={handleChange}
              checked={values.ratio === 1}
            />
            <span>Greater than 1</span>
          </div>
          <br />
          <div className="question">
            <p>Area Lighting</p>
          </div>
          <div className="options">
            <input
              type="radio"
              name="light"
              value="-1"
              onChange={handleChange}
              checked={values.light === -1}
            />
            <span>Dark</span>
            <input
              type="radio"
              name="light"
              value="0"
              onChange={handleChange}
              checked={values.light === 0}
            />
            <span>Moderate</span>
            <input
              type="radio"
              name="light"
              value="1"
              onChange={handleChange}
              checked={values.light === 1}
            />
            <span>Lit</span>
          </div>
          <br />
          <div className="question">
            <p>How safe did you feel?</p>
          </div>
          <div className="options">
            <input
              type="radio"
              name="safety"
              onChange={handleChange}
              checked={values.safety === -1}
              value="-1"
            />
            <span>I felt unsafe.</span>
            <input
              type="radio"
              name="safety"
              onChange={handleChange}
              checked={values.safety === 0}
              value="0"
            />
            <span>I felt fine</span>
            <input
              type="radio"
              name="safety"
              onChange={handleChange}
              checked={values.safety === 1}
              value="1"
            />
            <span>I felt comfortable</span>
          </div>
          <br />
          <center>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </center>
        </form>
      </div>
    </div>
  );
}
