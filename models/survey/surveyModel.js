var mongoose = require('mongoose');
// get schema for creating/connect model.
var surveySchema = require('./surveySchema.js').surveySchema;
// return model object
module.exports = mongoose.model('survey', surveySchema);

