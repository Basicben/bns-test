var mongoose = require('mongoose');
// get schema for creating/connect model.
var timeTableSchema = require('./timeTableSchema.js').timeTableSchema;
// return model object
module.exports = mongoose.model('timetable', timeTableSchema);
