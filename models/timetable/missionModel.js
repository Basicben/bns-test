var mongoose = require('mongoose');
// get schema for creating/connect model.
var missionsSchema = require('./timeTableSchema.js').missionsSchema;
// return model object
module.exports = mongoose.model('mission', missionsSchema);