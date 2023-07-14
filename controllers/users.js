const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../custom_errors/ConflictError');
const ForbiddenError = require('../custom_errors/ForbiddenError');
const NotFoundError = require('../custom_errors/NotFoundError');
const ValidationError = require('../custom_errors/ValidationError');

const SALT_ROUNDS = 10;
const JWT_SECRET = 'super-banana';

module.exports.getUsers = (req, res, next) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);

module.exports.getUserById = (req, res, next) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь с указанным _id не найден'));
    }
    return res.status(200).send(user);
  })
  .catch(next);

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return next(new ValidationError('Не передан логин или пароль'));
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) return next(new ConflictError('Пользователь уже существует'));
      return bcrypt.hash(password, SALT_ROUNDS);
    })
    .then((hash) => {
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((newUser) => res.status(200).send({
          _id: newUser._id,
          name: newUser.name,
          about: newUser.about,
          avatar: newUser.avatar,
          email: newUser.email,
        }));
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ValidationError('Не передана почта или пароль'));
  }
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return next(new ForbiddenError('Не правильная почта или пароль'));
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) return next(new ForbiddenError('Не правильная почта или пароль'));
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          return res.status(200).send({
            token,
          });
        });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateCurrentUser = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateCurrentUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      return res.status(200).send(user);
    })
    .catch(next);
};
