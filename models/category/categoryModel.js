var mongoose = require('mongoose');
// get schema for creating/connect model.
var categorySchema = require('./categorySchema.js');
// return model object
module.exports = mongoose.model('categories', categorySchema);

