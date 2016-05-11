var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// address
var addressSchema = new Schema({
    address: { type: String },
    city: { type: String, uppercase: true },
    country: { type: String, uppercase: true },
    zipcode: { type: String },
    coords: {
        longitude: { type: Number },
        latitude: { type: Number },
    }
});

module.exports = {
    addressSchema: addressSchema,
}