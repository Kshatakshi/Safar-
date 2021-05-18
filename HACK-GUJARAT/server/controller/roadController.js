const axios = require('axios');
const Road = require('../models/roadModel');
const dummyRoutes = require('./dummyRoutes');

const colors = {
  green: '#38A722',
  yellowGreen: '#9EAD00',
  yellow: '#F3DA58',
  orange: '#F7AB00',
  red: '#F22D1C',
};

const getCoordinates = async (address) => {
  const addressUrl = encodeURIComponent(address);
  const geoRes = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${addressUrl}&key=${process.env.GOOGLE_MAPS_API}`
  );

  const location = geoRes.data.results[0].geometry.location;
  return location;
};

const getCoordinatesMapbox = async (address) => {
  const addressUrl = encodeURIComponent(address);
  const geoRes = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${addressUrl}.json?access_token=${process.env.MAPBOX_TOKEN}`
  );

  const location = geoRes.data.features[0].center;

  return {
    lat: location[1],
    lng: location[0],
  };
};

// long,lat
const getRoutes = async (start, end) => {
  try {
    const directionsRes = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&alternatives=true&geometries=geojson&access_token=${process.env.MAPBOX_TOKEN}`
    );
    // console.log(directionsRes.data.routes);
    // console.log(directionsRes.data.routes[0].geometry.coordinates.length);
    return directionsRes.data.routes;
  } catch (err) {
    console.log(err);
  }
};

const getRoads = async (routes) => {
  const roadsInRoutes = [];
  routes.forEach((route) => {
    const road = [];
    const steps = route.legs[0].steps;

    steps.forEach((step) => {
      const found = road.some((ele) => ele.name === step.name);
      if (step.name && step.name !== '' && !found)
        road.push({ name: step.name, loc: step.maneuver.location });
      //   console.log(step.name);
    });

    roadsInRoutes.push(road);
  });

  return roadsInRoutes;
};

function Radian(degree) {
  const pi = Math.PI;
  return degree * (pi / 180);
}

// point = {lat: 464, long: 4542}
function distance(point1, point2) {
  const lat1 = Radian(point1.lat);
  const lat2 = Radian(point2.lat);
  const long1 = Radian(point1.long);
  const long2 = Radian(point2.long);

  const dlat = lat2 - lat1;
  const dlong = long2 - long1;

  const a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlong / 2), 2);

  const c = 2 * Math.asin(Math.sqrt(a));

  const r = 6371;

  return c * r;
}

const calcPoliceInVicinity = (dist) => {
  if (dist > 5) return -5;
  if (dist > 4.5) return -4;
  if (dist > 4) return -3;
  if (dist > 3.5) return -2;
  if (dist > 3) return -1;
  if (dist > 2.5) return 0;
  if (dist > 2) return 1;
  if (dist > 1.5) return 2;
  if (dist > 1) return 3;
  if (dist > 0.5) return 4;
  return 5;
};

async function getNearestPoliceStation(lat, long) {
  const placesRes = await axios.get(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=5000&type=police+station&keyword=police+station&key=${process.env.GOOGLE_MAPS_API}`
  );

  const results = placesRes.data.results;

  if (results.length === 0) return undefined;

  let leastDist = Infinity;
  let closestPS;

  results.forEach((result) => {
    const PSLocation = result.geometry.location;
    const dist = distance(
      { lat, long },
      { lat: PSLocation.lat, long: PSLocation.lng }
    );

    if (dist < leastDist) {
      leastDist = dist;
      closestPS = result;
    }
  });

  return {
    leastDist,
    closestPS,
  };
}

exports.getSafestRoutes = async (req, res, next) => {
  // convert addresses to coords
  const startAdd = req.body.startAdd;
  const destAdd = req.body.destAdd;

  // console.log(startAdd, destAdd);

  const startLoc = await getCoordinatesMapbox(startAdd);
  const destLoc = await getCoordinatesMapbox(destAdd);

  // console.log(startLoc, destLoc);

  // get all the routes from start to dest
  const routes = await getRoutes(
    [startLoc.lng, startLoc.lat],
    [destLoc.lng, destLoc.lat]
  );

  console.log(routes);

  // get roads in each route
  const roadsInRoutes = await getRoads(routes);

  console.dir(roadsInRoutes, { depth: null });

  const flattendRoads = roadsInRoutes.flat();
  // console.log(flattendRoads);

  await flattendRoads.forEach(async (road) => {
    const doc = await Road.findOne({ name: road.name });
    // if road not in database calculate policeInvicinity parameter and add to database
    if (!doc) {
      console.log('road not in db');
      const PS = await getNearestPoliceStation(road.loc[1], road.loc[0]);
      if (!PS) {
        await Road.create({
          name: road.name,
          coordinates: road.loc,
          policeInVicinity: -6,
        });
      } else {
        await Road.create({
          name: road.name,
          coordinates: road.loc,
          policeInVicinity: calcPoliceInVicinity(PS.leastDist),
          closestPoliceStation: PS.closestPS,
        });
      }
    } else {
      console.log('doc present');
    }
  });

  // all roads are in database now
  const myRoutes = [];

  for (let index = 0; index < routes.length; index++) {
    const routeGeometry = routes[index].geometry;
    const routeRoads = roadsInRoutes[index];

    const roadScoresPromises = routeRoads.map(async (road) => {
      const doc = await Road.findOne({ name: road.name });
      return doc.finalScore;
    });

    const roadScores = await Promise.all(roadScoresPromises);

    let routeScore = roadScores.reduce(
      (routeScore, roadScore) => routeScore + roadScore,
      0
    );

    routeScore = routeScore / routeRoads.length;
    if (!routeScore) routeScore = 2;

    // round to 2 decimal places
    routeScore = parseInt(routeScore.toFixed(2));

    // console.log(routeScore, routeRoads.length);
    console.log(routeScore);

    let routeColor;
    if (routeScore >= 5) routeColor = colors.green;
    else if (routeScore >= 4) routeColor = colors.yellowGreen;
    else if (routeScore >= 3) routeColor = colors.yellow;
    else if (routeScore >= 2) routeColor = colors.orange;
    else if (routeScore <= 2) routeColor = colors.red;

    const myRoute = {
      routeGeometry,
      routeRoads,
      routeScore,
      routeColor,
    };

    myRoutes.push(myRoute);
  }

  res.status(200).json({
    status: 'success',
    data: {
      routes: myRoutes,
      // routes: routes,
    },
  });
};

exports.submitFeedBack = async (req, res, next) => {
  const roads = req.body.roads;
  const feedback = req.body.feedback;
  roads.forEach(async (road) => {
    await Road.findOneAndUpdate({ name: road.name }, feedback);
  });
  res.status(200).json({
    status: 'success',
  });
};
