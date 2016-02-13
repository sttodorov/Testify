var TestEntry = require('mongoose').model('TestEntry');

module.exports = {
	create: function(testEntry, callback) {
		TestEntry.create(testEntry, callback);
	},
	findAllByUserId: function(userId, callback) {
		TestEntry.find({userId: userId}, callback);
	},
	findLatestByUserId: function(userId, callback)
	{
		TestEntry.find({userId: userId})
				.sort('dateCreated')
				.exec(callback);
	},
	averageUserScore:function(userId, callback)
	{
		TestEntry.aggregate([
		{
			$match:{'userId': userId},
		},
		{
			$group:{
					_id: '$_id',
					avgRating: {$avg: '$score'}
			}
		}
		]).exec(callback);
	}
};