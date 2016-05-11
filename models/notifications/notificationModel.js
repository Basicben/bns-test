var mongoose = require('mongoose');
// get schema for creating/connect model.
var notificationSchema = require('./notificationSchema.js').notificationSchema;
// return model object
module.exports = mongoose.model('notifications', notificationSchema);
