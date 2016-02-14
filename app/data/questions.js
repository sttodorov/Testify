var Question = require('mongoose').model('Question');

module.exports = {
	create: function(question, callback) {
		Question.create(question, callback);
	},
};