var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// field main schema.
var categorySchema = new Schema({
    name: { type: String, unique: true, required: true },
    lang: {
        en: { type: String, lowercase: true },
        he: { type: String, lowercase: true }
    },
    isActive: { type: Boolean , required: true, default: true },
    createDate: { type: Date , required: true, default: Date.now }
}, { collection: 'categories' });

// post function after every loginHistorySchema new document
categorySchema.post('save', function (doc) {
    console.log('typeSchema:: A new type has been saved %s\n', doc._id);
});

module.exports = categorySchema

