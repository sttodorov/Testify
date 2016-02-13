var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

module.exports.init = function() {

    var QuestionSchema = new Schema({
    title: String,
    Answers: [{title:String}],
    CorrectAnswer: String
    });

    QuestionSchema.virtual('dateCreated')
    .get(function(){
        return this._id.getTimestamp();
    });

    mongoose.model('Question', QuestionSchema);
};