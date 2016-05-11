var mongoose = require('mongoose');
var addressSchema = require('../address.js').addressSchema;
var Schema = mongoose.Schema;

// organization schema
var organizationSchema = new Schema({
    hostels: [{ type: Schema.ObjectId, ref: 'hostels' }],
    name: { type: String, required: true },
    website: { type: String, lowercase: true },
    description: { type: String },
    //phone: { type: String },
    //fax: { type: String },
    createdBy: { type: Schema.ObjectId, ref: 'user' },
    isActive : { type: Boolean, default: true },
    createDate: { type: Date , default: Date.now },
}, { collection: 'organizations' });

// post function after every organizationSchema new document
organizationSchema.post('save', function (doc) {
    console.log('organizationSchema:: A new organization has been saved %s\n', doc._id);
});

var maximumResidents = 4;

// apartment schema
var apartmentSchema = new Schema({
    name: { type: String, required: true },
    maximumResidents: { type: Number, default: maximumResidents },
    createdBy: { type: Schema.ObjectId, ref: 'user' },
    isActive : { type: Boolean, default: true, required: true },
    createDate: { type: Date , default: Date.now, required: true },
});

// hostel schema
var hostelSchema = new Schema( {
    organization: { type: Schema.ObjectId, ref: 'organizations', required: true },    
    apartments: [apartmentSchema],
    users: [{ type: Schema.ObjectId, ref: 'user' }],
    name: { type: String, required: true },
    address: [addressSchema],
    description: { type: String },
    website: { type: String, lowercase: true },
    phone: { type: String },
    fax: { type: String },
    timezone: { type: String, required: true },
    isActive : { type: Boolean, default: true, required: true },
    createdBy: { type: Schema.ObjectId, ref: 'user' },
    createDate: { type: Date , default: Date.now, required: true },
}, { collection: 'hostels' });

// post function after every hostelSchema new document
hostelSchema.post('save', function (doc) {
    console.log('hostelSchema:: A new hostel has been saved %s\n', doc._id);
});



module.exports = {
    organizationSchema: organizationSchema,
    hostelSchema: hostelSchema,
};
