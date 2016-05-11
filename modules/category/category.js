var categoryModel = require('../../models/category/categoryModel');
var errorEnum = GLOBAL.enums.errorTypes;

var category = {
    add: function (category, cb) {
        
    },
    addBulk: function (categories, cb) {
        
        categories = categories.map(function (t) {
            var obj = t;
            obj.isActive = true;
            obj.createDate = new Date();
            return obj;
        });

        categoryModel.collection.insert(categories, function (err, docs) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            cb(docs);
            console.log('%d categories were successfully stored.', docs.length);
        });
    },
    getAll: function (cb) {
        categoryModel
        .find({ isActive: true })
        .lean()
        .exec(function (err, array) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            if (!array) {
                cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
                return;
            }
            console.log('ss');
            cb({ result: array });
        });
    }
};

module.exports = category;