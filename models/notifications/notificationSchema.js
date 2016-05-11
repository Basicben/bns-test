var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// roles enum
var rolesEnum = {
    values: GLOBAL.enums.userRolesArrayMongo,
    message: 'enum validation faild for path `{PATH}` with value `{VALUE}'
}

// roles enum
var notificationEnum = {
    values: GLOBAL.enums.notificationTypesArrayMongo,
    message: 'enum validation faild for path `{PATH}` with value `{VALUE}'
}

// broadcastMessage schema
var broadcastMessageSchema = new Schema({
    destinationRole: [{ type: String, enum: rolesEnum, required: true }],
    content: { type: String, required:true },
    hostel: { type: Schema.ObjectId, ref: 'hostels' },
    sentBy: { type: Schema.ObjectId, ref: 'user', required: true },
    isActive : { type: Boolean, default: true },
    createDate: { type: Date , default: Date.now },
}, { collection: 'broadcastMessage' });


// post function after every broadcastMessageSchema new document
broadcastMessageSchema.post('save', function (doc) {
    console.log('broadcastMessageSchema:: A new boradcast message has been saved %s. From %s to %s\n', doc._id,doc.sentBy, doc.destinationRole);
});

// notification schema
var notificationSchema = new Schema({
    to: { type: Schema.ObjectId, ref: 'user', required: true },
    from: { type: Schema.ObjectId, ref: 'user', required: true },
    type: { type: String, enum: notificationEnum, required: true },
    entityId: { type: Schema.ObjectId, required: true },
    _object: { type: Schema.Types.Mixed, required: true },
    isRead : { type: Boolean, default: false },
    isActive : { type: Boolean, default: true },
    createDate: { type: Date , default: Date.now },
}, { collection: 'notifications' });


// post function after every notificationSchema new document
notificationSchema.post('save', function (doc) {
    console.log('notificationSchema:: A new notification type %s has been saved %s. From %s to %s\n', doc.type ,doc._id, doc.from, doc.to);
});

module.exports = {
    notificationSchema: notificationSchema,
    broadcastMessageSchema: broadcastMessageSchema,
};