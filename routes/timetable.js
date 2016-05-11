var Timetable = require('../modules/timetable/timetable.js');

var missionType = GLOBAL.enums.missionType;
var missionPrivacy = GLOBAL.enums.missionPrivacy;

var timetable = {
    addSocialActivity: function (req, res) {
        var activity = req.body.activity || '';
        var userId = req.user._id || '';
        var hostel = req.user.hostel || '';
        
        // validation       
        if (!validateSocialActivity(activity) || userId == '' || hostel == '' ) {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add activity to timetable function"
                }
            });
            return;
        }
        
        activity.createdBy = userId;
        Timetable.addSocialActivity(activity, hostel, function (result) {
            res.json(result);
        });
    },
    addSingleActivity: function (req, res) {
        var activity = req.body.activity || '';
        var userId = req.user._id || '';
        var role = req.user.role || '';
        var hostel = req.user.hostel || '';
        var apt = req.user.apartment || '';
    
        
        // validation       
        if (!validateActivity(activity) || userId == '' || role == '' || hostel == '' || apt == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add activity to timetable function"
                }
            });
            return;
        }
        
        activity.createdBy = userId;
        Timetable.addSingleActivity(activity, role, hostel, apt, function (result) {
            res.json(result);
        });
    },
    addMyActivity: function (req, res) {
        var activity = req.body.activity || '';
        var userId = req.user._id || '';
        var role = req.user.role || '';
        var hostel = req.user.hostel || '';
        var apt = req.user.apartment || '';
        
        // validation       
        if (!validateMyActivity(activity) || userId == '' || role == '' || hostel == '' || apt == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add activity to timetable function"
                }
            });
            return;
        }
        
        activity.users = userId;
        activity.createdBy = userId;
        Timetable.addSingleActivity(activity, role, hostel, apt, function (result) {
            res.json(result);
        });
    },
    get: function (req, res) {
        var userId = req.user._id || '';
        var options = req.body.options || '';
        if (userId == '' ) {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add hostel function"
                }
            });
            return;
        }
        console.log('userId', userId);
        Timetable.get(userId, options, function (result) {
            res.json(result);
        });
    },
    getOne: function (req, res) {
        var userId = req.user._id || '';
        var id = req.body.id || '';
        if (userId == '' || id == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add hostel function"
                }
            });
            return;
        }
        
        Timetable.get(userId, function (result) {
            res.json(result);
        });
    }
    
};

// validate if all user fileds are available
var validateActivity = function (activity) {
    if (!activity)
        return false;
    if (!activity.users || activity.users == '' || activity.users.length == 0)
        return false;
    if (!activity.start || activity.start == '')
        return false;
    if (!activity.mission || activity.mission == '')
        return false;

    return true;
}

// validate if all user fileds are available
var validateSocialActivity = function (activity) {
    if (!activity)
        return false;
    if (!activity.start || activity.start == '')
        return false;
    if (!activity.title || activity.title == '')
        return false;
    if (!activity.mission || activity.mission == '')
        return false;
    
    return true;
}

// validate if all user fileds are available
var validateMyActivity = function (activity) {
    if (!activity)
        return false;
    if (!activity.title || activity.title == '')
        return false;
    if (!activity.start || activity.start == '')
        return false;
    if (!activity.mission || activity.mission == '')
        return false;
    
    return true;
}


module.exports = timetable;