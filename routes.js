const request = require('request');
const auth = require('./auth.json');
const Parse = require('parse/node');
const bodyParser = require('body-parser');
const URL = 'https://api.housecanary.com/v2/';

module.exports = function (app) {
  var currentUser = Parse.User.current();

  app.get('/', function (req, res) {
    console.log(req.user)
    console.log(currentUser)
    res.render('pages/index.ejs', {
      user: currentUser
    });
  });

  app.post('/api/details', function (req, res) {
    var addressField = req.body.address
    var zipField = req.body.zipcode

    if (addressField === "" || zipField === "") {
      res.redirect('/')
    } else {
      request.get({
        url: URL + 'property/details_enhanced',
        auth: {
          user: auth.HC_API_KEY,
          pass: auth.HC_API_SEC
        },
        qs: {
          zipcode: zipField,
          address: addressField
        }
      }, function (error, response, body) {
        data = JSON.parse(body)[0]
        var address = data.address_info.address_full
        var lat = data.address_info.lat
        var lng = data.address_info.lng
        res.render('pages/results', {
          results: body,
          userLat: lat,
          userLng: lng,
          apiKey: auth.GOOGLE_MAPS_KEY
        });
      });
    }
  });

  app.get('/login', function (req, res) {
    res.render('pages/login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login', function (req, res) {
    var loginUser = Parse.User.logIn(req.body.email, req.body.password, {
      useMasterKey: true,
      success: function (loginUser) {
        res.redirect('/')
      },
      error: function (loginUser, error) {
        console.log(error)
      }
    })
  });

  app.get('/signup', function (req, res) {
    res.render('pages/signup.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/signup', function (req, res) {
    var newUser = new Parse.User()
    newUser.set("username", req.body.email);
    newUser.set("password", req.body.password);
    console.log(newUser)
    newUser.signUp(null, {
      useMasterKey: true,
      success: function (newUser) {
        console.log(newUser)
        res.redirect('/')
      },
      error: function (newUser, error) {
        console.log(error)
      }
    });
  });

  app.get('/logout', function (req, res) {
    Parse.User.logOut().then(function () {
      currentUser = Parse.User.current(); // this will now be null
    });
    res.redirect('/');
  });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  if (req.isAuthenticated()) return next();

  res.redirect('/');
}
