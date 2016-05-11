var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// missions enum
var missionPrivacyEnum = {
    values: GLOBAL.enums.missionPrivacyArrayMongo,
    message: 'enum validation faild for path `{PATH}` with value `{VALUE}'
}

// priority enum
var priorityEnum = {
    values: GLOBAL.enums.priorityTypesArrayMongo,
    message: 'enum validation faild for path `{PATH}` with value `{VALUE}'
}


// priority enum
var missionEnum = {
    values: GLOBAL.enums.missionTypeArrayMongo,
    message: 'enum validation faild for path `{PATH}` with value `{VALUE}'
}



// missions schema
var missionsSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    hostel: { type: Schema.ObjectId, ref: 'hostels' },
    category: { type: Schema.ObjectId, ref: 'categories', required: true },
    createdBy: { type: Schema.ObjectId, ref: 'user' },
    createDate: { type: Date , default: Date.now, required: true },
    lastUpdated: { type: Date , default: Date.now, required: true },
    isUseOnce: { type: Boolean, default: true },
    isActive : { type: Boolean, default: true, required: true }
});

// post function after every missionsSchema new document
missionsSchema.post('save', function (doc) {
    console.log('missionsSchema:: A new mission has been saved %s to hostel %s\n', doc._id, doc.hostel);
});

// time table missions schema
var timeTableSchema = new Schema({
    users: [{ type: Schema.ObjectId, ref: 'user' }],
    title: { type: String },
    description: { type: String },
    image: { type: String },
    start: { type: Date , required: true },
    end: { type: Date, default: null },
    mission: { type: Schema.ObjectId, ref: 'mission' },
    priority: { type: String, enum: priorityEnum },
    privacy: { type: String, enum: missionPrivacyEnum, default: GLOBAL.enums.missionPrivacy.private.name, required: true },
    type: { type: String, enum: missionEnum, required: true },
    isEditable : { type: Boolean, default: true },
    isFixed: { type: Boolean, default: false },
    isActive : { type: Boolean, default: true },
    createdBy: [{ type: Schema.ObjectId, ref: 'user' }],
    createDate: { type: Date , default: Date.now }
});

// post function after every timeTableSchema new document
timeTableSchema.post('save', function (doc) {
    console.log('timeTableSchema:: A new mission has been saved in timetable %s to user %s\n', doc._id, doc.user);
});

module.exports = {
    timeTableSchema: timeTableSchema,
    missionsSchema: missionsSchema,
};
