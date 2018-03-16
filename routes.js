const request = require('request');
const auth = require('./auth.json')

module.exports = function (app, passport) {
  app.get('/', function (req, res) {
    res.render('pages/index.ejs', {
      user : req.user
    });
  });

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
    }, function (error, response, data) {
      data = JSON.parse(data)[0]
      var address = data.address_info.address_full
      var lat = data.address_info.lat
      var lng = data.address_info.lng
      res.render('pages/results', {
        results: address,
        userLat: lat,
        userLng: lng,
        apiKey: auth.GOOGLE_MAPS_KEY
      });
    });
  });

  app.get('/login', function (req, res) {
    res.render('pages/login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/', 
    failureRedirect: '/login', 
    failureFlash: true 
  }));

  app.get('/signup', function (req, res) {

    res.render('pages/signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  if (req.isAuthenticated()) return next();

  res.redirect('/');
}
