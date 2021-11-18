const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const IncorrectData = require('../errors/IncorrectData');

function getCards(req, res) {
  return Card.find({})
    .then((cards) => {
      res
        .status(200)
        .send(cards);
    })
    .catch(() => {
      throw new NotFound('Карточки не найдены.');
    });
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => {
      throw new IncorrectData('Переданы некорректные данные.');
    })
    .catch(next);
}

function deleteCard(req, res) {
  const { cardId: _id } = req.params;
  return Card.findByIdAndRemove({ _id }, { new: true })
    .then((card) => {
      res
        .status(200)
        .send(card);
    })
    .catch(() => {
      throw new IncorrectData('Переданы некорректные данные.');
    });
}

function likeCard(req, res) {
  const { cardId: _id } = req.params;
  const ownId = req.user._id;
  return Card.findByIdAndUpdate({ _id }, { $addToSet: { likes: ownId } }, { new: true })
    .then((card) => {
      res
        .status(200)
        .send(card);
    })
    .catch(() => {
      throw new IncorrectData('Переданы некорректные данные.');
    });
}

function disLikeCard(req, res) {
  const { cardId: _id } = req.params;
  const ownId = req.user._id;
  return Card.findByIdAndUpdate({ _id }, { $pull: { likes: ownId } }, { new: true })
    .then((card) => {
      res
        .status(200)
        .send(card);
    })
    .catch(() => {
      throw new IncorrectData('Переданы некорректные данные.');
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
};