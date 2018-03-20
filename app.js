const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const ParseServer = require('parse-server').ParseServer;
const app = express();

const auth = require('./auth.json');

app.use(morgan('dev')); // logs

var api = new ParseServer({
  databaseURI: auth.MONGO_KEY,
  appId: process.env.APP_ID || auth.PARSE_KEY,
  masterKey: process.env.MASTER_KEY || auth.MASTER_KEY, //Add your master key here.
  serverURL: process.env.SERVER_URL || 'http://localhost:3000/parse', 
  liveQuery: {
    classNames: ["Users"] // List of classes to support for query subscriptions
  },
  restAPIKey: "hiassistant-test"
});
const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

app.set('view engine', 'ejs')

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'testhiassistant',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(flash());
app.use(express.static('public'))

require('./routes.js')(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Listening on ' + PORT)
})
