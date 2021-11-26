const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

const port = 3000;
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '619e73afcd3958342eb4aa0f',
  };
  next();
});
app.use(routes);

const notFound = (req, res, next) => {
  res.status(404).send({ message: 'Ресурс не найден.' });
  next();
};
app.use('*', notFound);

app.listen(port, () => {
  console.log(`MESTO-13 app listening at http://localhost:${port}`);
});
