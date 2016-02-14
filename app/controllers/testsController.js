var encryption = require('../utilities/encryption'),
	tests = require('../data/tests'),
	testEntries = require('../data/testEntries')


var CONTROLLER_NAME = 'tests';

module.exports = {

	getOpenTests: function(req, res, next) {
		res.render(CONTROLLER_NAME + '/open');
	},
	getHostTest: function(req, res, next) {
		res.render(CONTROLLER_NAME + '/host');
	},
	postHostTest: function(req, res, next) {
		var data = req.body;
		var test = {
			title: data.title,
			host: req.user._id,
			questions: []
		};

		var i=1;;
		while(!!data['title-question-'+ i]){
			var question = {title:"", Answers:[], CorrectAnswer:""};
			question.title = data['title-question-'+i]
			data['option-question-'+i].forEach(function(option){
				question.Answers.push(option);
			})
			question.CorrectAnswer = question.Answers[data['correct-question-'+ i] - 1];
			test.questions.push(question);
			i++
		}
		tests.create(test,function(err, test)
		{
			if (err) {
				console.log('Failed to create test: ' + err);
				return;
			}
			req.session.success = 'Test created sucessfully!';
			res.redirect("/openTests");
		});
	},
}