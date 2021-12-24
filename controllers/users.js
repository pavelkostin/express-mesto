const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

function getUsers(req, res, next) {
  return User.find({})
    .then((users) => {
      res
        .status(200)
        .send(users);
    })
    .catch((err) => {
      next(err);
    });
}

function getMyProfile(req, res, next) {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден.');
    })
    .then((user) => {
      res
        .status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError(`Пользователь по ID: ${req.user._id} не найден.`));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий ID пользователя.'));
      } else {
        next(err);
      }
    });
};

function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Вы пытаетесь зарегистрироваться по уже существующему в базе email.');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(200).send({ email, id: user._id }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден.');
    })
    .then((user) => {
      res
        .status(200)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден.');
    })
    .then((user) => {
      res
        .status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Неверная почта или пароль.'));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getUsers,
  getMyProfile,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
