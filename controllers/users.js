const User = require('../models/user');

function getUsers(req, res) {
  return User.find({})
    .then((users) => {
      res
        .status(200)
        .send(users);
    })
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Пользователи не найдены.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

const getUserById = (req, res) => {
  const { userId: _id } = req.params;
  return User.findById({ _id })
    .orFail(() => {
      throw new Error('404');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Пользователь не найден.' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Нет пользователя с таким id. Некоректные данные.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res
        .status(201)
        .send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некоректные данные.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

function updateUser(req, res) {
  const ownId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate((ownId), { name, about }, { new: true })
    .then((user) => {
      res
        .status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Пользователь не найден.' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Нет пользователя с таким id. Некоректные данные.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Пользователь не найден.' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Нет пользователя с таким id. Некоректные данные.' });
      }
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
