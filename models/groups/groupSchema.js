var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// common interest group schema
var groupSchema = new Schema({
    name: { type: String, required: true }, // survey's option name
    users: [{ type: Schema.ObjectId, ref: 'user', required: true }],
    img: { type: String },
    content: { type: String },
    //expirationDate: { type: Date , default: new Date() },
    option: { type: Schema.ObjectId },
    survey: { type: Schema.ObjectId, ref: 'survey' },
    createdBy: { type: Schema.ObjectId, ref: 'user' },
    createDate: { type: Date , default: Date.now },
    isActive: { type: Boolean, default: true }
}, { collection: 'group' });

// post function after every groupSchema new document
groupSchema.post('save', function (doc) {
    console.log('groupSchema:: A new group has been saved %s. Created by %s\n', doc._id, doc.createdBy);
});

// group message schema
var groupMessagingSchema = new Schema({
    name: { type: String, required: true }, // survey's option name
    group: { type: Schema.ObjectId, ref: 'group', required: true },
    sender: { type: Schema.ObjectId, ref: 'user', required: true },
    content: { type: String, required:true },
    //expirationDate: { type: Date , default: new Date() },
    modifiedDate: { type: Date , default: Date.now },
    createDate: { type: Date , default: Date.now },
    isActive: { type: Boolean, default: true }
}, { collection: 'groupMessage' });

// post function after every groupMessagingSchema new document
groupMessagingSchema.post('save', function (doc) {
    console.log('groupMessagingSchema:: A new group message has been saved %s. To group %s, sent by %s\n', doc._id, doc.group, doc.sender);
});

// 
module.exports = {
    groupSchema: groupSchema,
    groupMessagingSchema: groupMessagingSchema
}

