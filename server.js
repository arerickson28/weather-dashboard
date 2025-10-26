const express = require('express');
const path = require('path');
const routes = require('./api');
require('dotenv').config();


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(routes);


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });