var mongoose = require('mongoose');
// get schema for creating/connect model.
var groupMessagingSchema = require('./groupSchema.js').groupMessagingSchema;
// return model object
module.exports = mongoose.model('groupMessage', groupMessagingSchema);

