var groupModel = require('../../models/groups/groupModel.js');
var cu = require('../utils/commonUtils.js');

var group = {
    add: function (groupObj,cb) { 
        if (cu.isArray(groupObj)) {
            groupModel.collection.insert(groupObj, function (err, docs) {
                if (err) {
                    cb({ err: { code: errorEnum.partialInsert.code , msg: errorEnum.partialInsert.msg } });
                }
                cb({ result: true });
            });
        } else {
            var group = groupModel(groupObj);
            group.save(function (err, cGroup) {
                if (err) {
                    cb({ err: { code: errorEnum.partialInsert.code , msg: errorEnum.partialInsert.msg } });
                    return;
                }

                cb({ result:true });
            
            });
        }
        
    },
    getGroupsBySurvey: function (surveyId,cb) { 
        groupModel.find({ 'survey': surveyId }, function (err, docs) {
            
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            cb({ result : docs });

        });
    },
    getGroupsByUser: function (userId,cb) {
        groupModel.find({ 'users': { $in:[userId] } }, function (err, docs) {
            
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            cb({ result : docs });

        });
    },
};

module.exports = group;