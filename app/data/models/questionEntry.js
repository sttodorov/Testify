var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

module.exports.init = function() {
    var QuestionEntrySchema = new Schema({
    questionId: String,
    selectedAnswer: String
    });

    QuestionEntrySchema.virtual('dateCreated')
    .get(function(){
        return this._id.getTimestamp();
    });

    mongoose.model('QuestionEntry', QuestionEntrySchema);
};