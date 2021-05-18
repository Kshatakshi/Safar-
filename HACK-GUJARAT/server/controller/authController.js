const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    phone_no: req.body.phone_no,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    contact_info: req.body.contact_info,
  });

  createSendToken(newUser, 201, res);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(Error('Please provide email and password!'));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(Error('Incorrect email or password'));
  }

  createSendToken(user, 200, res);
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
/*exports.signup = async (req, res, next) => {
  const newUser = await User.create(req.body);
  
  const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
      status:'success',
      token,
      data:{
          user:newUser
      }
  })
};*/

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
    console.log(req.cookie.jwt);
  }

  if (!token) {
    return next(
      Error('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      Error('The user belonging to this token does no longer exist.', 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

/*exports.updateMe = async (req, res, next) => {
  
  
  if (req.body.password || req.body.passwordConfirm) {
    return next(Error('This route is not for password updates. Please use /updateMyPassword.'));
  }

  // Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
    if(req.file) filteredBody.photo =req.file.filename;
  
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
};*/
