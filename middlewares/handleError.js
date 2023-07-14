const ValidationError = require('../custom_errors/ValidationError');

const httpConstants = require('http2').constants;

const handleError = (err, res, next) => {
  if (err.name === 'CastError') err = new ValidationError('Некорректные данные');
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Произошла ошибка на стороне сервера' : message });
  next();
};

module.exports = handleError;
