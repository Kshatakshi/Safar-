import React, { Component, useState, useEffect, useContext } from 'react';
import { RoadsContext } from '../contexts';
import axios from 'axios';
import PolylineOverlay from './PolyLineOverlay';
import { Redirect, Link } from 'react-router-dom';
import { PageHeader, Menu, Button, Drawer, Row, Col } from 'antd';
import './search.css';
import 'antd/dist/antd.css';
import ReactMapGL from 'react-map-gl';
import Header from './Header';
// import routes from '../../../server/controller/dummyRoutes';
export default function Home(props) {
  const { roads, setRoads } = useContext(RoadsContext);

  const [viewport, setviewport] = useState({
    latitude: 21.2786567,
    longitude: 81.8661442,
    width: '100vw',
    height: '70vh',
    zoom: 10,
  });

  const [token, settoken] = useState(
    'pk.eyJ1Ijoia3NoYXRha3NoaSIsImEiOiJja2VuOHl5b24weWFwMnJtcXF5MXR0ZDFhIn0.dUfYcwHvsc5e8AOLg0ZKJA'
  );
  const [collapsed, setCollapsed] = useState(false);
  const [signup, setSignup] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [SafestRoutes, setSafestRoutes] = useState([]);
  const [ready, setReady] = useState(false);

  const getPosition = (position) => {
    setviewport((prevState) => ({
      // object that we want to update
      ...prevState, // keep all other key-value pairs
      latitude: position.coords.latitude,
      longitude: position.coords.longitude, // update the value of specific key
    }));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(getPosition);
    } else {
      console.log('error');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log(from);
    console.log(to);

    const res = await axios.post('/api/roads/getSafestRoute', {
      startAdd: from,
      destAdd: to,
    });
    setReady(false);
    console.log(res.data);
    // res.data.data.routes[1].routeColor = '#F7AB00';
    // res.data.data.routes[1].routeScore = 2;
    setReady(true);
    setSafestRoutes(res.data.data.routes);
    setviewport((prevState) => ({
      // object that we want to update
      ...prevState, // keep all other key-value pairs
      latitude: res.data.data.routes[0].routeGeometry.coordinates[0][1],
      longitude: res.data.data.routes[0].routeGeometry.coordinates[0][0], // update the value of specific key
    }));
    // console.log('submit');
  };

  const changeHandlerTo = (e) => {
    let value = e.target.value.replace(/<[^>]*>?/gm, '');

    setTo(value);
  };

  const changeHandlerfrom = (e) => {
    let value = e.target.value.replace(/<[^>]*>?/gm, '');

    setFrom(value);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div>
      <Header />
      <center>
        <form onSubmit={onSubmit} method="POST" className="form">
          <Row>
            <Col xs={7}>
              <span className="form-fields1 required">From </span>
            </Col>
            <Col xs={15}>
              <input
                className="form-control1"
                type="text"
                name="from"
                value={from}
                onChange={changeHandlerfrom}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={7}>
              <span className="form-fields1 required">To </span>
            </Col>
            <Col xs={15}>
              <input
                className="form-control1"
                type="text"
                name="to"
                value={to}
                onChange={changeHandlerTo}
              />
            </Col>
          </Row>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <br />
        </form>
      </center>
      <button className="sos">SOS</button>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={token}
        onViewportChange={(viewport) => setviewport({ ...viewport })}
        mapStyle="mapbox://styles/kshatakshi/cken9e08331um19mt5bn8gnp6"
      >
        {ready &&
          SafestRoutes.map((route) => (
            <div>
              <PolylineOverlay
                points={route.routeGeometry.coordinates}
                color={route.routeColor}
              />
            </div>
          ))}
      </ReactMapGL>
      <div
        className="paths"
      >
        {ready &&
          SafestRoutes.map((route, idx) => (
            <div
              style={{
                backgroundColor: route.routeColor
              }}
              className="routebox"
            >
              <h3>{idx + 1}</h3>
              <p>Safety score: {route.routeScore}</p>
              <Button
                type="primary"
                onClick={() => {
                  setRoads(route.routeRoads);
                  props.history.push(`/feedback`);
                }}
              >
                FEEDBACK
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
