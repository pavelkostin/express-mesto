const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

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
      if (err.name === 'ValidationError') throw new BadRequestError('Переданы некорректные данные.');
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

function deleteCard(req, res, next) {
  return Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        card.remove();
        res
          .status(200)
          .send(card);
      } else {
        res
          .status(403)
          .send({ message: `Карточку c _id: ${req.params.cardId} создал другой пользователь.` });
      }
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError(`Карточка по ID: ${req.params.cardId} не найдена.`));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий ID карточки.'));
      } else {
        next(err);
      }
    });
}

function likeCard(req, res, next) {
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
        next(new NotFoundError(`Карточка по ID: ${req.params.cardId} не найдена.`));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий ID карточки.'));
      } else {
        next(err);
      }
    });
}

function disLikeCard(req, res, next) {
  const { cardId: _id } = req.params;
  const ownId = req.user._id;
  Card.findByIdAndUpdate({ _id }, { $pull: { likes: ownId } }, { new: true })
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
        next(new NotFoundError(`Карточка по ID: ${req.params.cardId} не найдена.`));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий ID карточки.'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
};
