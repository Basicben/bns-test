var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cu = require('../../modules/utils/commonUtils.js');

// roles enum
var surveyEnum = {
    values: GLOBAL.enums.surveyTypesArrayMongo,
    message: 'enum validation faild for path `{PATH}` with value `{VALUE}'
}

var optionsSchema = new Schema({
    name: { type: String, required: true },
    img: { type: String },
    content: { type: String },        
    createDate: { type: Date , default: Date.now },
    isActive: { type: Boolean, default: true }
});

// field main schema.
var surveySchema = new Schema({
    title: { type: String, required: true },
    type: { type: String, enum: surveyEnum, required: true },
    content: { type: String },
    options: [optionsSchema],
    votes: [{
            user: { type: Schema.ObjectId, ref: 'user', required: true },
            option: { type: Schema.ObjectId, required: true },
            createDate: { type: Date , default: Date.now },
        }],
    total: { type: Number },
    hostel: { type: Schema.ObjectId, ref: 'hostels', required: true },
    createdBy: { type: Schema.ObjectId, ref: 'user', required: true },
    expirationDate: { type: Date , default: cu.expiresIn(GLOBAL.conf.surveys.expirationDefaultInDays) },
    createDate: { type: Date , default: Date.now },
    isActive: { type: Boolean, default: true }
}, { collection: 'survey' });

// post function after every surveySchema new document
surveySchema.post('save', function (doc) {
    console.log('surveySchema:: A new survey has been saved %s to hostel %s\n', doc._id, doc.hostel);
});

// 
module.exports = {
    surveySchema: surveySchema,
}

