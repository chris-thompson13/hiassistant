const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();

const auth = require('./auth');

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {

  res.render('pages/index', {
    api: auth.GOOGLE_MAPS_KEY
  })

})

app.post('/api', function (req, res) {
  var address = req.body.address
  var zip = req.body.zipcode
  var url = 'https://api.housecanary.com/v2/property/geocode'

  request.get({
    url: url,
    auth: {
      user: auth.HC_API_KEY,
      pass: auth.HC_API_SEC
    },
    qs: {
      zipcode: zip,
      address: address
    }
  }, function (error, response, body) {
    res.render('pages/results', {
      results: body
    });
  });
});

// Login stuff???

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Listening on ' + PORT)
})
