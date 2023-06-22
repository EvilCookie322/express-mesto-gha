const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(bodyParser.urlencoded({ extended: true }));
