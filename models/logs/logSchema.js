var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statusEnum = {
    values: GLOBAL.enums.loginLogsArrayMongo,
    message: 'enum validation faild for path `{PATH}` with value `{VALUE}'
};

// field main schema.
var loginHistorySchema = new Schema({
    ip: { type: String },
    status: { type: String, enum: statusEnum },
    id: { type: String },
    email: { type: String, lowercase: true },
    location: {
        country: { type: String, uppercase: true },
        city: { type: String, lowercase: true }
    },
    createDate: { type: Date , default: Date.now },
}, { collection: 'loginHistory' });

// post function after every loginHistorySchema new document
loginHistorySchema.post('save', function (doc) {
    console.log('loginHistorySchema:: A new history log has been saved %s for ip %s. status :: %s\n', doc._id, doc.ip, doc.status);
});

// field main schema.
var changePassowrdSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'user', required: true },
    oldPassword: { type: String, required: true },
    newPassword: { type: String, required: true },
    createDate: { type: Date , default: Date.now },
}, { collection: 'changePasswordHistory' });


// post function after every changePassowrdSchema new document
changePassowrdSchema.post('save', function (doc) {
    console.log('changePassowrdSchema:: A new change password has been saved %s for user %s\n', doc._id, doc.user);
});

// 
module.exports = {
    loginHistorySchema: loginHistorySchema,
    changePassowrdSchema: changePassowrdSchema,
}

