var mongoose = require('mongoose');
// get schema for creating/connect model.
var userForgotPasswordSchema = require('./userSchema.js').userForgotPasswordSchema;
// return model object
module.exports = mongoose.model('userForgotPassword', userForgotPasswordSchema);
