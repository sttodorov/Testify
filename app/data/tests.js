var Test = require('mongoose').model('Test');

module.exports = {
	create: function(test, callback) {
		Test.create(test, callback);
	},
};