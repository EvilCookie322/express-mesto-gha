const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../custom_errors/NotFoundError');

router.use(userRouter);
router.use(cardRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
