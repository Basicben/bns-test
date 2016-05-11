var mongoose = require('mongoose');
// get schema for creating/connect model.
var userSchema = require('./userSchema.js').userSchema;
// return model object
module.exports = mongoose.model('user', userSchema);
