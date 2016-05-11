var mongoose = require('mongoose');
// get schema for creating/connect model.
var hostelSchema = require('./organizationSchema.js').hostelSchema;
// return model object
module.exports = mongoose.model('hostels', hostelSchema);
