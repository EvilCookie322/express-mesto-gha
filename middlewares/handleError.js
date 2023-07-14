const httpConstants = require('http2').constants;
const ValidationError = require('../custom_errors/ValidationError');

const handleError = (err, res, next) => {
  let error = err;
  if (err.name === 'CastError') error = new ValidationError('Некорректные данные');
  const { statusCode = httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = error;
  res.status(statusCode).send({ message: statusCode === httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Произошла ошибка на стороне сервера' : message });
  next();
};

module.exports = handleError;
