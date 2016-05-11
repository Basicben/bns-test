var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var addressSchema = require('../address.js').addressSchema;

// roles enum
var rolesEnum = {
    values: GLOBAL.enums.userRolesArrayMongo,
    message: 'enum validation faild for path `{PATH}` with value `{VALUE}'
}

var contactRelationEnum = {
    values: GLOBAL.enums.contactRelationsArrayMongo,
    message: 'enum validation faild for path `{PATH}` with value `{VALUE}'
}

// user schema
var userSchema = new Schema({
    email: { type: String, lowercase: true, match: [/\S+@\S+\.\S+/, 'invalid email address.'], required: true, unique: true },
    id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String, required : true },
    salt: { type: String, required: true },
    role: { type: String, enum: rolesEnum, required: true },
    apartment: { type: Schema.ObjectId, required : false },
    hostel: { type: Schema.ObjectId, ref: 'hostels' },
    address: [addressSchema],
    phone: { type: String },
    birthday: { type: Date },
    contact: [{
            relation: { type: String, enum: contactRelationEnum, required: true},
            phone: { type: String },
            email: { type: String },
            address: [addressSchema],
    }],
    photo: {
        small: { type: String },
        medium: { type: String },
        big: { type: String }
    },
    createdBy: { type: Schema.ObjectId, ref: 'user' },
    isActive : { type: Boolean, default: true, required: true },
    createDate: { type: Date, default: new Date(), required: true }
});

// post function after every userSchema new document
userSchema.post('save', function (doc) {
    console.log('userSchema:: A new %s has been saved. id : %s\n', doc.role, doc._id);
});

var userForgotPasswordSchema = new Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'user' },
    token: { type: String },
    expirationDate: { type: Date },
    createDate: { type: Date , default: Date.now },
    isActive: { type: Boolean }
}, { collection: 'userForgotPassword' });

// post function after every userForgotPassword new document
userForgotPasswordSchema.post('save', function (doc) {
    console.log('userForgotPassword:: A user %s has forgotten password\n', doc.user);
});

module.exports = {
    userSchema: userSchema,
    userForgotPasswordSchema: userForgotPasswordSchema,
};
