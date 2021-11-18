const router = require('express').Router();
const { getUsers } = require('../controllers/users');
const { getUserById } = require('../controllers/users');
const { createUser } = require('../controllers/users');
const { updateUser } = require('../controllers/users');
const { updateAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;