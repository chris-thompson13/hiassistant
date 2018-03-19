const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();

const auth = require('./auth.json');

mongoose.connect(auth.MONGO_KEY);

app.set('view engine', 'ejs')


app.use(morgan('dev')); // log every request to the console
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'testhiassistant'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use(express.static('public'))
require('./config/passport.js')(passport)
require('./routes.js')(app, passport);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Listening on ' + PORT)
})
