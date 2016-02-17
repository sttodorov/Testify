	var encryption = require('../utilities/encryption'),
		users = require('../data/users'),
		testEntries = require('../data/testEntries')


	var CONTROLLER_NAME = 'users';
	var usernamePattern = /^[A-Za-z0-9._ ]{6,20}$/;

	module.exports = {
	getRegister: function(req, res, next) {
		res.render(CONTROLLER_NAME + '/register')
	},
	postRegister: function(req, res, next) {
		var userData = req.body;
		if(userData.username.length <6)
		{
			req.session.error = 'Username too short. Min 6 chars!';
			res.redirect('/register');
			return;
		}
		if(!usernamePattern.test(userData.username))
		{
			req.session.error = 'Username not valid!';
			res.redirect('/register');
			return;
		}
		users.findByUsername(userData.username, function(err, user) {
			if(!!user) {
				req.session.error = 'Username already taken!';
				res.redirect('/register');
				return;
			}
		});
		if (userData.password != userData.confirmPassword) {
			req.session.error = 'Passwords do not match!';
			res.redirect('/register');
			return;
		}
		if(userData.age < 1 ||userData.age > 100)
		{
			req.session.error = 'Age must me non negative and less than 100';
			res.redirect('/register');
			return;
		}
		userData.salt = encryption.generateSalt();
		userData.hashPass = encryption.generateHashedPassword(userData.salt, userData.password);

		users.create(userData, function(err, user) {
			if (err) {
				console.log('Failed to register new user: ' + err);
				return;
			}
			req.logIn(user, function(err) {
				if (err) {
					res.status(400);
					return res.send({reason: err.toString()}); // TODO
				}
				else {
					res.redirect('/');
				}
			})
		});
	},
	getLogin: function(req, res, next) {
		res.render(CONTROLLER_NAME + '/login');
	},
	getProfile: function(req, res, next) {
		testEntries.averageUserScore(req.user._id, function(err, result)
		{
			if(err)
			{
				req.session.error = err;
				res.redirect('/password');
				return;
			}
			res.render(CONTROLLER_NAME + '/profile', {avgScore: (!!result && result.length > 0) ? result[0].avgRating.toFixed(2) : 0});
		});
	},
	getPassword: function(req, res, next) {
		res.render(CONTROLLER_NAME + '/password');
	},
	postPassword: function(req, res, next) {
		var passwordData = req.body;
		var currentHashPass = encryption.generateHashedPassword(req.user.salt, passwordData.oldPassword);
		if (currentHashPass !== req.user.hashPass) {
			req.session.error = 'Invalid old password';
			res.redirect('/password');
			return;
		}
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			req.session.error = 'Passwords do not match!';
			res.redirect('/password');
			return;
		}

		var newHashPass = encryption.generateHashedPassword(req.user.salt, passwordData.newPassword);
		var conditions = { _id: req.user._id }
			, update = {$set: {hashPass: newHashPass}}
			, options = {};

		users.update(conditions, update, options, function(err, numAffected) {
			if (err) {
				console.log('Failed to change password: ' + err);
				return;
			}
			req.session.success = 'Password successfully changed!';
			res.redirect('/profile');
		});
	}
};