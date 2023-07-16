const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getUsers,
  getUserById,
  createUser,
  updateCurrentUser,
  updateCurrentUserAvatar,
  login,
  getCurrentUser,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar:
      Joi.string()
        .regex(/^((ftp|http|https):\/\/)?([\w\S]+)\.([a-z]{2,6}\.?)+(\/[\S]*)*(\.[a-z]+)?(\/\S)?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);
router.get('/users/me', getCurrentUser);
router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateCurrentUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar:
      Joi.string()
        .required()
        .regex(/^((ftp|http|https):\/\/)?([\w\S]+)\.([a-z]{2,6}\.?)+(\/[\S]*)*(\.[a-z]+)?(\/\S)?$/),
  }),
}), updateCurrentUserAvatar);

module.exports = router;
