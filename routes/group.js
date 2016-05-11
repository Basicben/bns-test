var Group = require('../modules/groups/group.js');

var group = {
    getGroupsBySurvey: function (req, res) {
        var surveyId = req.body.surveyId || '';
        // validation       
        if (surveyId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add hostel function"
                }
            });
            return;
        }
        
        Group.getGroupsBySurvey(surveyId, function (result) {
            res.json(result);
        });
    },
    getGroups: function (req, res) {
        var userId = req.user._id || '';
        if (userId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add hostel function"
                }
            });
            return;
        }

        Group.getGroupsByUser(userId, function (result) {
            res.json(result);
        });
    },
    
};

module.exports = group;