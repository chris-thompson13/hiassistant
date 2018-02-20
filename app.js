const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const request = require('request');
const bodyparser = require('body-parser');

app.use(express.static('public'))

app.get('/', function (req, res, next) {
  // set frontend variables in here for EJS -Jeremy
  res.sendFile(__dirname + '/index.ejs')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, function () {
  console.log('Listening on ' + PORT)
})
