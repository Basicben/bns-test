var mongoose = require('mongoose');
// get schema for creating/connect model.
var loginSchema = require('./logSchema.js');
// return model object
module.exports = mongoose.model('changePasswordHistory', loginSchema.changePassowrdSchema);

