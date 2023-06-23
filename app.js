const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64944eac25fcaf984299e114',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
