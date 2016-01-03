// dependencies
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create schema for collection
var User = mongoose.model('User', new Schema({
	id: ObjectId,
	username: {type: String, unique: true },
	password: String,
	email: {type: String, unique: true },
}))

app.set('view engine', 'jade');
app.locals.pretty = true; 

// MongoDB
mongoose.connect('mongodb://localhost/auth');

// Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
	cookieName: 'session',
	secret: 'asdfasdflkjhg', // change secret for security
	duration: 30*60*1000,
	activeDuration: 5*60*1000,
}));
app.use(bodyParser.json());

// routes
app.use(express.static(__dirname + '/views'));

// index page
app.get('/', function(req, res) {
	if (req.session && req.session.user) {
		User.findOne({ username: req.session.user.username }, function(err, user) {
			if (!user) {
				req.session.reset();
				res.render('index.jade');
			} else {
				res.locals.user = user;
				res.redirect('/dashboard');
			}
		});
	} else {
		res.render('index.jade');
	}
});

// register page
app.get('/register', function(req, res) {
	if (req.session && req.session.user) {
		User.findOne({ username: req.session.user.username }, function(err, user) {
			if (!user) {
				req.session.reset();
				res.render('register.jade');
			} else {
				res.locals.user = user;
				res.redirect('/dashboard');
			}
		});
	} else {
		res.render('register.jade');
	}
});
app.post('/register', function(req, res) {
	if (req.body.password == req.body.checkPword){
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(req.body.password, salt); //hash pword for security
		var user = new User({
			email: req.body.email,
			username: req.body.username,
			password: hash,
		});
		user.save(function(err) {
			if (err) {
				res.render('register.jade', {error: 'That user or email is already taken, try again.'});
			} else {
				req.session.user = user;
				res.redirect('/dashboard');
			}
		});
	} else {
		res.render('register.jade', {error: 'The passwords you entered do not match, try again.'});
	}
});

// login page
app.get('/login', function(req, res) {
	if (req.session && req.session.user) {
		User.findOne({ username: req.session.user.username }, function(err, user) {
			if (!user) {
				req.session.reset();
				res.render('login.jade');
			} else {
				res.locals.user = user;
				res.redirect('/dashboard');
			}
		});
	} else {
		res.render('login.jade');
	}
});
app.post('/login', function(req, res) {
	User.findOne({ username: req.body.username }, function(err, user) {
		if (!user) {
			res.render('login.jade', {error: 'Invalid username or password.'});
		} else {
			if (bcrypt.compareSync(req.body.password, user.password)) {
				req.session.user = user;
				res.redirect('/dashboard');
			} else {
				res.render('login.jade', {error: 'Invalid username or password.'});
			}
		}
	});
});

// dashboard page
app.get('/dashboard', function(req, res) {
	if (req.session && req.session.user) {
		User.findOne({ username: req.session.user.username }, function(err, user) {
			if (!user) {
				req.session.reset();
				res.redirect('/login');
			} else {
				res.locals.user = user;
				res.render('dashboard.jade');
			}
		});
	} else {
		res.redirect('/login');
	}
});

app.get('/logout', function(req, res) {
	req.session.reset();
	res.redirect('/');
});

// Start server
app.listen(3000);
console.log('Server is running on port 3000.');