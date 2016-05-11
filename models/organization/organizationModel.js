var mongoose = require('mongoose');
// get schema for creating/connect model.
var organizationSchema = require('./organizationSchema.js').organizationSchema;
// return model object
module.exports = mongoose.model('organizations', organizationSchema);
