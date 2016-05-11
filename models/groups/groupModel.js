var mongoose = require('mongoose');
// get schema for creating/connect model.
var groupSchema = require('./groupSchema.js').groupSchema;
// return model object
module.exports = mongoose.model('group', groupSchema);

