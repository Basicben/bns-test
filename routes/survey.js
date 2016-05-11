var SURVEY = require('../modules/notifications/survey.js');
var HOSTEL = require('../modules/hostel/hostel.js');
var sa = require('../sockets/index.js').actions;

var notificationTypes = GLOBAL.enums.notificationTypes;
var roleTypes = GLOBAL.enums.userRoles;

var survey = {
    add: function (req, res) {
        var newSurvey = req.body.newSurvey || '';
        var createdBy = req.user._id || '';
        var hostel = req.user.hostel || '';
        if (!validateSurvey(newSurvey) || createdBy == '' || hostel == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
        
        newSurvey.hostel = hostel;
        newSurvey.createdBy = createdBy;
        
        SURVEY.add(newSurvey, function (result) {
            // return survey object validation
            if (!result.err) {
                var Notification = require('../modules/notifications/notifications.js');
                // get all clients and send them a notification
                HOSTEL.getClientIds(req.user.hostel, roleTypes.client.name, function (clients) {
                    if (!clients.err) {
                        var notification = {
                            hostel: result.result.hostel,
                            from: result.result.createdBy,
                            _object:{
                                title:      result.result.title,
                                content:    result.result.content,
                                type:       result.result.type,
                                createDate: result.result.createDate,
                            },
                            entityId: result.result._id,
                            type: notificationTypes.survey.name,
                        };
                        Notification.add(notification, clients.result);
                        //sa.sendNotification(req.user.hostel, clients.result, notificationTypes.survey.name, function () { });
                    }
                });
            }
            
            res.json(result);
        });
    },
    get: function (req, res) {
        var surveyId = req.body.surveyId || '';
        if (surveyId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for get survey function"
                }
            });
            return;
        }
        SURVEY.get(surveyId, function (result) {
            res.json(result);
        });
    },
    getCreatedSurveys: function (req, res) {
        var userId = req.user._id || '';
        if (userId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for get survey function"
                }
            });
            return;
        }
        SURVEY.getCreatedSurveys(userId, function (result) {
            res.json(result);
        });
    },
    vote: function (req, res) {
        var surveyId = req.body.surveyId || '';
        var optionId = req.body.optionId || '';
        var userId = req.user._id || '';
        if (surveyId == '' || optionId == '' || userId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for get survey function"
                }
            });
            return;
        }
        SURVEY.vote(surveyId, optionId, userId, function (result) {
            res.json(result);
        });
    },
};

// validate if all user fileds are available
var validateSurvey = function (surveyObj) {
    if (!surveyObj)
        return false;
    if (!surveyObj.title || surveyObj.title == '')
        return false;
    if (!surveyObj.content || surveyObj.content == '')
        return false;
    if (!surveyObj.type || surveyObj.type == '')
        return false;
    if (!surveyObj.options || surveyObj.options.length == 0)
        return false;
    
    // TODO::
    // iterate through every option and validate fields. (title, content, img[not mandatory] )

    //if (!surveyObj.expirationDate)
    //    return false;
    
    return true;
}


module.exports = survey;
