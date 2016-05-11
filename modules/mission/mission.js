var missionModel = require('../../models/timetable/missionModel');

var errorEnum = GLOBAL.enums.errorTypes;

var mission = {
    add: function (newMission, cb) {
        mission = missionModel(newMission);
        mission.save(function (err, obj) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            cb({ result : obj });
        });
    },
    get: function (hostelId, missionId, cb) {
        
        var query = {
            'hostel': hostelId,
            'isUseOnce':false,
        }
        
        if (missionId != '')
            query['_id'] = missionId;

        missionModel
        .find(query)
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
            
            cb({ result: array });
        });
    },
};

module.exports = mission;