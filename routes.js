const request = require('request');
const auth = require('./auth.json');
const Parse = require('parse/node');
const bodyParser = require('body-parser');
const URL = 'https://api.housecanary.com/v2/';

module.exports = function (app) {
  var currentUser = Parse.User.current()

  app.get('/', function (req, res) {
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

  app.get('/business', function (req, res) {
    var data = JSON.parse(req.session)
    res.render('pages/business.ejs', {
      user: req.session
    });
  })

  app.post('/business', function (req, res) {
    var User = Parse.Object.extend('Users');
    var query = new Parse.Query(User);
    query.equalTo("id", req.session.user.id);
    query.first({
      success: function (user) {
        console.log(user)
        user.set("fullName", req.body.fullName);
        user.set("businessName", req.body.businessName);
        user.set("businessAddress", req.body.businessAddress);
        user.set("businessPhone", req.body.businessPhone);
        user.set("inspectorList", req.body.insList);
        user.set("salesPitch", req.body.sales);
        user.set("website", req.body.website);
        // user.set("profilePic", req.body.profilePic);

        user.save();
        res.redirect('/')

      },
      error: function (error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  })

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
        res.render('pages/login.ejs', {
          message: req.flash(error)
        });
      }
    })
  });

  app.get('/signup', function (req, res) {

    res.render('pages/signup.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/signup', function (req, res) {

    if (req.body.password === req.body.conPassword) {
      var newUser = new Parse.User()
      newUser.set("username", req.body.email);
      newUser.set("password", req.body.password);
      newUser.set("userType", req.body.userType);

      newUser.signUp(null, {
        useMasterKey: true,
        success: function (newUser) {
          // I need to get the user here to save the extra info
          req.session.user = newUser
          res.render('pages/business.ejs', {
            user: req.session.user
          })
        },
        error: function (newUser, error) {
          res.render('pages/signup.ejs', {
            message: error.message
          });
        }
      });
    } else {
      res.render('pages/signup.ejs', {
        message: req.flash('loginMessage')
      });
    }
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
