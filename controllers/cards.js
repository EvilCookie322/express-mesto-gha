const Card = require('../models/card');
const NotFoundError = require('../custom_errors/NotFoundError');
const ForbiddenError = require('../custom_errors/ForbiddenError');
const ValidationError = require('../custom_errors/ValidationError');

module.exports.getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch(next);

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    if (String(card.owner) !== req.user._id) {
      return next(new ForbiddenError('Вы не можете удалять чужие карточки'));
    }
    return Card.deleteOne({ cardId: card.cardId })
      .then(() => res.status(200).send({ message: 'Success' }));
  })
  .catch(next);

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  {
    $addToSet: { likes: req.user._id },
  },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.status(200).send(card);
  })
  .catch(next);

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  {
    $pull: { likes: req.user._id },
  },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.status(200).send(card);
  })
  .catch(next);
