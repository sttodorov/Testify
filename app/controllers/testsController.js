var encryption = require('../utilities/encryption'),
	tests = require('../data/tests'),
	testEntries = require('../data/testEntries')


var CONTROLLER_NAME = 'tests';

// TODO: Create middleware to store request in session, so that on server error filed will be filled woth user's choice again

module.exports = {

	getOpenTests: function(req, res, next) {
		res.render(CONTROLLER_NAME + '/open');
	},
	getHostTest: function(req, res, next) {
		res.render(CONTROLLER_NAME + '/host');
	},
	getOpenAndFutureTests: function(req, res, next)
	{
		tests.openAndFutureTests(function(err, data){
			if(err)
			{
				req.session.error = err;
				res.redirect('/tests');
				return;
			}
			res.render(CONTROLLER_NAME + '/tests', {title: "Open and future tests", tests: data, userId: req.user._id});
		});
	},

	getPastTests: function(req, res, next)
	{
		tests.pastTests(function(err, data){
			if(err)
			{
				req.session.error = err;
				res.redirect('/tests');
				return;
			}
			res.render(CONTROLLER_NAME + '/tests', {title: "Past tests", tests: data, userId: req.user._id});
		});
	},
	joinTest: function(req,res,next){
		tests.findById(req.body.testId, function(err, test){
			if(!test)
			{
				req.session.error = "Test not found";
				res.redirect('/tests');
				return;
			}
			if(err)
			{
				req.session.error = err;
				res.redirect('/tests');
				return;
			}
			// TODO: Should or not join when test hasn't started yet.
			if(test.endTime < new Date())
			{
				req.session.error = "Cannot join ended test";
				res.redirect('/tests');
				return;
			}

			if(test.participantsIds.indexOf(req.user._id) > -1)
			{
				req.session.error = "You are already member of this test.";
				res.redirect('/tests');
				return;
			}


			tests.pushUser(req.body.testId,req.user._id,function(err,data){
				if(err)
				{
					req.session.error = err;
					res.redirect('/tests');
					return;
				}
				res.redirect('/tests/'+req.body.testId);
			});
		});

	},
	getTestSubmittion: function(req,res,next){
		tests.findById(req.params.id, function(err,test){
			if(err)
			{
				req.session.error = err;
				res.redirect('/tests');
				return;
			}
			if(test.participantsIds.indexOf(req.user._id) < 0){
				req.session.error = "You do not participate in this test";
				res.redirect('/tests');
				return;
			}
			if(test.startTime > new Date()){
				req.session.error = "You still cannot go to test submittion. Test starts at: " + test.startTime.toLocaleString();
				res.redirect('/tests');
				return;
			}

			testEntries.findByUserIdAndTestId({userId:req.user._id , testId:test._id}, function(err, testEntriesFound){

				if(!!testEntriesFound && testEntriesFound.length < 1)
				{

					if(test.endTime <= new Date())
					{
					req.session.error = "Cannot open closed test, if you haven't submit it.";
					res.redirect('/tests');
					return;
					}

					req.session.success = "Start test submittion";
					res.render(CONTROLLER_NAME + '/submittion', {test: test});
					return;
				}

				console.log("----------------Past test submittion is: ", testEntriesFound[testEntriesFound.length-1])
				res.render(CONTROLLER_NAME + '/submittion', {test: test, submittion: testEntriesFound[testEntriesFound.length-1]});
			});

		});
	},
	postTestSubmittion: function(req,res,next){
		// TODO: validate if user is participant
		var data = req.body;
		var testSubmittion = {
			userId: req.user._id,
			testId: req.params.id,
			Answers: [],
			score: 0
		};
		tests.findById(testSubmittion.testId, function(err, test){
			var pointsPerQuestion = 100/test.questions.length,
				i=1;
			if(err)
			{
				req.session.error = err;
				res.redirect('/tests/'+req.params.id);
				return;
			}
			// BUG if there is a gap in ids some anwers will be ignored
			while(data['answer-question-'+ i]){
				var question = { questionId:"", selectedAnswer:""};

					if(data["answer-question-"+i] && (data["answer-question-"+i] < 1 || data["answer-question-"+i] > test.questions[i-1].Answers.length))
					{
						req.session.error = "Question "+ i +" has no answer " + data["answer-question-"+i];
						res.redirect('/tests/'+req.params.id);
						return;
					}

					question.questionId = test.questions[i-1]._id;
					question.selectedAnswer = test.questions[i-1].Answers[data["answer-question-"+i]-1];
					if(question.selectedAnswer == test.questions[i-1].CorrectAnswer){
						testSubmittion.score+=pointsPerQuestion;
					}
				testSubmittion.Answers.push(question);
				i++;
			}

			testEntries.findByUserIdAndTestId({userId:req.user._id , testId:test._id}, function(err, testEntriesFound){
				if(err)
				{
					req.session.error = err;
					res.redirect('/tests/'+req.params.id);
					return;
				}

				if(!testEntriesFound || testEntriesFound.length > 0)
				{
					req.session.error = "User can submit test only once!";
					res.redirect('/tests/'+req.params.id);
					return;
				}

				testEntries.create( testSubmittion, function(err,data){
					if(err)
					{
						req.session.error = err;
						res.redirect('/tests/'+req.params.id);
						return;
					}
					req.session.success = 'Test submitted sucessfully! Your Score is ' + testSubmittion.score + '%';
					res.redirect("/tests");
				});
			})

		});
	},
	postHostTest: function(req, res, next) {
		var data = req.body;

		if(data.title && data.title.length < 3){
			req.session.error = 'Test title cannot be empty or less that 3 symbols';
			res.redirect('/hostTest');
			return;
		}
		if(data.sartDate && data.endDate){
			req.session.error = 'End date and time are missing.';
			res.redirect('/hostTest');
			return;
		}

		var test = {
			title: data.title,
			host: req.user._id,
			questions: [],
			participantsIds: [],
			startTime: new Date(data.startDate + ' ' + data.startTime).toISOString(),
			endTime: new Date(data.endDate + ' ' + data.endTime).toISOString()
		};
		console.log("FROM: ", test.startTime);
		console.log("To: ", test.endTime);

		if((test.endTime - test.startTime)/60000 < 10){
			req.session.error = 'End date must be at least 10 minutes after start time.';
			res.redirect('/hostTest');
			return;
		}

		var i=1;
		while(data['title-question-'+ i]){
			var question = {title:"", Answers:[], CorrectAnswer:""};

			if(data['title-question-'+i] && data['title-question-'+i].length < 3 ){
				req.session.error = 'Question' + i + ' title cannot be empty or less than 3 symbols';
				res.redirect('/hostTest');
				return;
			}
			question.title = data['title-question-'+i];

			if(data['option-question-'+i] && data['option-question-'+i].length < 2){
				req.session.error = 'Question' + i + ' must have at least 2 options';
				res.redirect('/hostTest');
				return;
			}
			data['option-question-'+i].forEach(function(option){
				if(option && option.length < 2){
					req.session.error = 'Option cannot be shorter than 3 symbols';
					res.redirect('/hostTest');
					return;
				}
				question.Answers.push(option);
			});

			if(data['correct-question-'+ i] && (data['correct-question-'+ i] < 1 || data['correct-question-'+ i] > question.Answers.length)){
				req.session.error = 'Correct answer value must be beteen 1 and ' + question.Answers.length + ' inclusive';
				res.redirect('/hostTest');
				return;
			}

			question.CorrectAnswer = question.Answers[data['correct-question-'+ i] - 1];
			test.questions.push(question);
			i++;
		}

		test.participantsIds.push(req.user._id);
		tests.create(test,function(err, test)
		{
			if(err)
			{
				req.session.error = err;
				res.redirect('/hostTest');
				return;
			}
			req.session.success = 'Test created sucessfully!';
			res.redirect("/tests");
		});
	}
}