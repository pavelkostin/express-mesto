const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/notFoundError');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

const port = 3000;
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(express.json());

app.use('/signup', createUser);
app.use('/signin', login);
app.use(auth);
app.use(routes);
app.use('*', (req, res, next) => next(new NotFoundError('Ресурс не найден.')));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`MESTO-13 app listening at http://localhost:${port}`);
});
