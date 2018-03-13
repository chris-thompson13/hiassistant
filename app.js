const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const request = require('request');
const bodyparser = require('body-parser');
const app = express();

const auth = require('./auth');

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', function (req, res) {

  res.render('pages/index', {
    api: auth.GOOGLE_MAPS_KEY
  })

})

app.post('/estimate', function(req, res){
  console.log(req.body)
})

// Login stuff???

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Listening on ' + PORT)
})
