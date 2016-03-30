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

router.get('/add', function(req, res, next) {
  res.render('addcategory', {
  	"title": "Add Category"
  });
});

router.post('/add', function(req, res, next){
	var name = req.body.name;

		//form validation
	req.checkBody('name', 'Name field is required').notEmpty();

	var errors = req.validationErrors();

	if (errors){
		res.render('addcategory', {
			"errors": errors,
		});
	} else {
		var categories = db.get('categories');

		categories.insert({
			"name": name
		}, function(err, post) {
			if(err){
				res.send(err);
			} else{
				req.flash('success', 'Category added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;