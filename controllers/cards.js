const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => {
      res
        .status(200)
        .send(cards);
    })
    .catch((err) => {
      next(err);
    });
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') throw new BadRequestError('Переданы некорректные данные.');
      next(err);
    });
}

function deleteCard(req, res, next) {
  return Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError(`Карточка по ID: ${req.params.cardId} не найдена.`);
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        card.remove();
        res
          .status(200)
          .send(card);
      } else {
        next(new ForbiddenError(`Карточку c _id: ${req.params.cardId} создал другой пользователь. Нельзя удалять чужие карточки.`));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
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
