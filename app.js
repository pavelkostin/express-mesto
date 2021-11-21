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
    _id: '619a21e7cb971945a2fa08d0',
  };
  next();
});
app.use(routes);
app.use("*", (req, res, next) => next(new Error("Ресурс не найден.")));

app.listen(port, () => {
  console.log(`MESTO-13 app listening at http://localhost:${port}`);
});
