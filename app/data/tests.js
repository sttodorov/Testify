var Test = require('mongoose').model('Test');

function getNowAsIso()
{
	return new Date().toISOString();
}

module.exports = {
	create: function(test, callback) {
		Test.create(test, callback);
	},
	openAndFutureTests: function(callback){
		Test.find({endTime : {'$gte': getNowAsIso()}},callback);
	},
	openTests: function(callback){
		Test.find({endTime : {'$gte': getNowAsIso()}, startTime: {'$lt' : getNowAsIso()}},callback)
	},
	pastTests: function(callback){
		Test.find({endTime : {'$lt': getNowAsIso()}},callback);
	},
	findById: function(testId, callback){
		Test.findById(testId,callback);
	},
	pushUser: function(testId, userId, callback){
		Test.findByIdAndUpdate(testId,{$push: {participantsIds: userId}},callback)
	}
};