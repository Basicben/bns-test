var mongoose = require('mongoose');
// get schema for creating/connect model.
var broadcastMessageSchema = require('./notificationSchema.js').broadcastMessageSchema;
// return model object
module.exports = mongoose.model('broadcastMessage', broadcastMessageSchema);
