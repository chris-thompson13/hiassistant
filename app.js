const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const request = require('request');
const bodyparser = require('body-parser');

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', function (req, res) {
  // set frontend variables in here for EJS -Jeremy
  var example = 'This is cool right?'
  res.render('pages/index', {
    example: example
  })

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Listening on ' + PORT)
})
