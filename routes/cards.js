const router = require('express').Router();
const { getCards } = require('../controllers/cards');
const { createCard } = require('../controllers/cards');
const { deleteCard } = require('../controllers/cards');
const { likeCard } = require('../controllers/cards');
const { disLikeCard } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', disLikeCard);

module.exports = router;
