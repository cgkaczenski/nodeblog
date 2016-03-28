var express = require('express');
var expressValidator= require('express-validator');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var mongo = require('mongodb');
var multer = require('multer');
var db;
var env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  db = require('monk')(process.env.MONGOLAB_URI);
} else {
  db = require('monk')('localhost/nodeblog');
}

var app = express();
app.locals.moment = require('moment');


var routes = require('./routes/index');


app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Handle File Uploads & Multipart Data
app.use(multer({ dest: './public/images/uploads'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect-Flash
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


