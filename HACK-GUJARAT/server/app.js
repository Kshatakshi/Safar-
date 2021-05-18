const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRouter');
const roadRouter = require('./routes/roadRouter');
const cors = require('cors');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/roads', roadRouter);
module.exports = app;
