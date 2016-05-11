var timetableModel = require('../../models/timetable/timetableModel');
var cu = require('../utils/commonUtils.js');
var moment = require('moment');
var errorEnum = GLOBAL.enums.errorTypes;
var missionTypes = GLOBAL.enums.missionType;

var timetable = {
    addSingleActivity: function (newActivity, role, hostel, aptId, cb) {
        newActivity.type = missionTypes.single.name;
        console.log(newActivity);
        this.add(newActivity, role, hostel, aptId, cb);
    },
    add: function (newActivity, role, hostel, aptId, cb) {
        
        // add assignment to timetable
        function addTimeTableCallback(res) {
            if (!res) {
                cb({ err: { code: errorEnum.noAuthorization.code , msg: errorEnum.noAuthorization.msg } });
                return;
            }
            
            //console.log('newActivity', newActivity);
            
            var ass = timetableModel(newActivity);
            ass.save(function (err, obj) {
                if (err) {
                    cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                    return;
                }
                
                cb({ result : obj });
            });
        }
        // returns true if user is authorized to add an assignment
        //  newActivity.user[0] SHOULD BE CHANGED TO AN ARRAY
        cu.isAllowedToOperate(newActivity.createdBy, role, hostel, aptId, newActivity.users, addTimeTableCallback);
        
    },
    get: function (userId, filter, cb) {
        console.log('cu.firstDayOfWeek()', cu.firstDayOfWeek().toDate());
        console.log('cu.lastDayOfWeek()', cu.lastDayOfWeek().toDate());
        // TODO:: REPLACE GOOD QUERY WITH BAD
        // this is the right query
        var findQuery = { "users" : { $in : [userId] }, "isActive": true, start: { $gte: cu.firstDayOfWeek() , $lt: cu.lastDayOfWeek() } };
        // this is the bad query
        // var findQuery = { "users" : { $in : [userId] }, "isActive": true };
        
        if (filter && filter.dateFrom)
            findQuery.createDate['$gte'] = filter.dateFrom;
        
        if (filter && filter.dateTo)
            findQuery.createDate['$lt'] = filter.dateTo;
        
        timetableModel
        .find(findQuery)
        .populate('mission')
        .select('-isActive')
        .sort('-createDate')
        .exec(function (err, timetable) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            if (!timetable) {
                cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
                return;
            }
            
            
            cb({ result: timetable });
        });
    },
    addSocialActivity: function (newActivity, hostel, cb) {
        newActivity.privacy = GLOBAL.enums.missionPrivacy.public.name;
        newActivity.priority = GLOBAL.enums.priority.high.name;
        newActivity.type = GLOBAL.enums.missionType.social.name;
        newActivity.isEditable = false;
        newActivity.isFixed = false;
        var ass = timetableModel(newActivity);
        ass.save(function (err, obj) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            cb({ result : obj });
        });
    }
};

module.exports = timetable;