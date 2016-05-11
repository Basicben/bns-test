var Mission = require('../modules/mission/mission.js');

var errorEnum = GLOBAL.enums.errorTypes;
var missionEnum = GLOBAL.enums.missionPrivacy;

var mission = {
    add: function (req, res) {
        var newMission = req.body.newMission || '';
        newMission.hostel = req.user.hostel || '';
        if (!validateMission(newMission)) {
            res.status(401); 
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        Mission.add(newMission,function (result) {
            res.json(result);
        });
    },
    get: function (req, res) {
        var hostelId = req.user.hostel || '';
        var missionId = req.body.missionId || '';

        if (hostelId == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
        
        Mission.get(hostelId,missionId, function (result) {
            res.json(result);
        });
    }
}

// validate if all user fileds are available
var validateMission = function (missionObj) {
    if (!missionObj)
        return false;
    if (!missionObj.hostel || missionObj.hostel == '')
        return false;
    if (!missionObj.title || missionObj.title == '')
        return false;
    if (missionObj.category == '')
        return false;
    if (!missionObj.description || missionObj.description == '')
        return false;
    
    return true;
}


module.exports = mission;
