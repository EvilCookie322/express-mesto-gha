const User = require("../models/user");

const handleError = (err, res) => {
  if (err.name === "ValidationError")
    return res
      .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: "Введены некорректные данные" });
  if (err.name === "CastError")
    return res
      .status(404)
      .send({ message: "Пользователь с указанным _id не найден" });
  res
    .status(httpConstants.HTTP_STATUS_SERVER_ERROR)
    .send({ message: "Произошла ошибка на стороне сервера" });
};

module.exports.getUsers = (req, res, next) =>
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      handleError(err, res);
    });

module.exports.getUserById = (req, res, next) =>
  User.findById(req.params.userId)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      handleError(err, res);
    });

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) =>
      res
        .status(201)
        .send({ name: user.name, about: user.about, avatar: user.avatar })
    )
    .catch((err) => {
      handleError(err, res);
    });
};

module.exports.updateCurrentUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next({
          statusCode: 404,
          message: "Пользователь с указанным _id не найден",
        });
      }
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      handleError(err, res);
    });
};

module.exports.updateCurrentUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      handleError(err, res);
    });
};
