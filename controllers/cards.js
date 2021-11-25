const Card = require('../models/card');

function getCards(req, res) {
  Card.find({})
    .then((cards) => {
      res
        .status(200)
        .send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

function deleteCard(req, res) {
  const { cardId: _id } = req.params;
  return Card.findByIdAndRemove({ _id }, { new: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      res
        .status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Карточка не найдена.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

function likeCard(req, res) {
  const { cardId: _id } = req.params;
  const ownId = req.user._id;
  Card.findByIdAndUpdate({ _id }, { $addToSet: { likes: ownId } }, { new: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      res
        .status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

function disLikeCard(req, res) {
  const { cardId: _id } = req.params;
  const ownId = req.user._id;
  Card.findByIdAndUpdate({ _id }, { $pull: { likes: ownId } }, { new: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      res
        .status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан несуществующий _id карточки.' });
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
