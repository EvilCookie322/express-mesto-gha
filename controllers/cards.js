const httpConstants = require('http2').constants;
const Card = require('../models/card');

const handleError = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res
      .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Некорректные данные' });
  }
  return res
    .status(httpConstants.HTTP_STATUS_SERVER_ERROR)
    .send({ message: 'Произошла ошибка на стороне сервера' });
};

module.exports.getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch((err) => handleError(err, res));

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      handleError(err, res);
    });
};

module.exports.deleteCardById = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      return res
        .status(httpConstants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Карточка не найдена' });
    }
    return res.status(200).send({ message: 'Success' });
  })
  .catch((err) => {
    handleError(err, res);
  });

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  {
    $addToSet: { likes: req.user._id },
  },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res
        .status(httpConstants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Карточка не найдена' });
    }
    return res.status(200).send(card);
  })
  .catch((err) => {
    handleError(err, res);
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  {
    $pull: { likes: req.user._id },
  },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res
        .status(httpConstants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Карточка не найдена' });
    }
    return res.status(200).send(card);
  })
  .catch((err) => {
    handleError(err, res);
  });
