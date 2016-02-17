var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Question = mongoose.model('Question'),
    Schema = mongoose.Schema;

module.exports.init = function() {

    var TestSchema = new Schema({
    title: String,
    host: {type: mongoose.Schema.Types.ObjectId, required: true},
	participantsIds: {type: [mongoose.Schema.Types.ObjectId], default:[]},
    questions: {type:[Question.schema], default:[]},
	startTime: { type : Date, default: Date.now },
	endTime: { type : Date, default: Date.now },
    });

    TestSchema.virtual('dateCreated')
    .get(function(){
        return this._id.getTimestamp();
    });

    mongoose.model('Test', TestSchema);
};