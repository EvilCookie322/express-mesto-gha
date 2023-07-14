const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const handleError = require('./middlewares/handleError');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {useNewUrlParser: true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use(errors());
app.use((err, req, res, next) => {
  handleError(err, res, next);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
