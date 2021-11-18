const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const IncorrectData = require('../errors/IncorrectData');

function getUsers(req, res, next) {
  return User.find({})
    .then((users) => {
      res
        .status(200)
        .send(users);
    })
    .catch((err) => {
      res.status(500)
        .send({
          message: `Ошибка: ${err.message}`,
        });
    })
    .catch(next);
}

function getUserById(req, res, next) {
  const { userId: _id } = req.params;
  return User.findById({ _id })
    .then((user) => {
      res
        .status(200)
        .send(user);
    })
    .catch(() => {
      throw new NotFound('Пользователь не найден.');
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res
        .status(201)
        .send({ user });
    })
    .catch(() => {
      throw new IncorrectData('Переданы некорректные данные.');
    })
    .catch(next);
}

function updateUser(req, res, next) {
  const ownId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate((ownId), { name, about }, { new: true })
    .then((user) => {
      res
        .status(200)
        .send(user);
    })
    .catch(() => {
      throw new IncorrectData('Переданы некорректные данные.');
    })
    .catch(next);
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({ user }))
    .catch(() => {
      throw new IncorrectData('Переданы некорректные данные.');
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
