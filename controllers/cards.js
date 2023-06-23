const Card = require("../models/card");
const httpConstants = require("http2").constants;

const handleError = (err, res) => {
  if (err.name === "ValidationError")
    return res
      .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: "Некорректные данные" });
  if (err.name === "CastError")
    return res
      .status(httpConstants.HTTP_STATUS_NOT_FOUND)
      .send({ message: "Карточка не найдена" });
  res
    .status(httpConstants.HTTP_STATUS_SERVER_ERROR)
    .send({ message: "Произошла ошибка на стороне сервера" });
};

module.exports.getCards = (req, res, next) =>
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => handleError(err, res));

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((newCard) =>
      res.status(201).send({ name: newCard.name, link: newCard.link })
    )
    .catch((err) => {
      handleError(err, res);
    });
};

module.exports.deleteCardById = (req, res, next) =>
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.status(200).send({ message: "Success" });
    })
    .catch((err) => {
      handleError(err, res);
    });

module.exports.likeCard = (req, res, next) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      handleError(err, res);
    });

module.exports.dislikeCard = (req, res, next) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      handleError(err, res);
    });