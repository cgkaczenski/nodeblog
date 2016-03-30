var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db;
var env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  db = require('monk')(process.env.MONGOLAB_URI);
} else {
  db = require('monk')('localhost/nodeblog');
}

// Homepage Blog Post
router.get('/', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({},{}, function(err, posts){
  	res.render('index', {
  		'posts': posts
  	});
  });
});

module.exports = router;
