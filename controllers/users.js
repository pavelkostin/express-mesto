const User = require('../models/user');

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      res
        .status(200)
        .send(users);
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

const getUserById = (req, res) => {
  const { userId: _id } = req.params;
  User.findById({ _id })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: `Пользователь по ID: ${_id} не найден.` });
      } else if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан несуществующий ID пользователя.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res
        .send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

function updateUser(req, res) {
  const ownId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate((ownId), { name, about }, { runValidators: true, new: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res
        .status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные.' });
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res
        .status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные.' });
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
