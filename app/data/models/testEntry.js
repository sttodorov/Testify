var mongoose = require('mongoose'),
    QuestionEnty = mongoose.model('QuestionEntry'),
    Schema = mongoose.Schema;

module.exports.init = function() {
    var TestEntrySchema = new Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    testId: {type:mongoose.Schema.Types.ObjectId, ref: 'Test', required: true},
    Answers: {type:[QuestionEnty], default: []}
    });

    TestEntrySchema.virtual('dateCreated')
    .get(function(){
        return this._id.getTimestamp();
    });

    mongoose.model('TestEntry', TestEntrySchema);
};