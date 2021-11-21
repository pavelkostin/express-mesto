const Card = require('../models/card');

function getCards(req, res) {
  return Card.find({})
    .then((cards) => {
      res
        .status(200)
        .send(cards);
    })
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Карточки не найдены.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

function deleteCard(req, res) {
  const { cardId: _id } = req.params;
  return Card.findByIdAndRemove({ _id }, { new: true })
    .then((card) => {
      res
        .status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Карточка не найдена.' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Нет карточки с таким id. Некоректные данные.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
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
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Карточка не найдена.' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Нет карточки с таким id. Некоректные данные.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
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
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Карточка не найдена.' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Нет карточки с таким id. Некоректные данные.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
};