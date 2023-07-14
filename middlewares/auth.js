const jwt = require('jsonwebtoken');
const AuthError = require('../custom_errors/AuthorizationError');

const JWT_SECRET = 'super-banana';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new AuthError('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
