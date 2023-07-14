const jwt = require('jsonwebtoken');
const AuthError = require('../custom_errors/AuthorizationError');

const JWT_SECRET = 'super-banana';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
