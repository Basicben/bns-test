var Notification = require('../modules/notifications/notifications.js');

var notification = {
    get: function (req, res) {
        var userId = req.user._id || '';
        // validation       
        if (userId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for get notification function"
                }
            });
            return;
        }
        
        Notification.get(userId, function (result) {
            res.json(result);
        });
    },
    getSpecific: function (req, res) {
        var userId = req.user._id || '';
        var type = req.body.type || '';
        var entityId = req.body.entityId || '';
        // validation       
        if (type == '' || entityId == '' || !GLOBAL.enums.notificationTypes[type]) {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for get notification function"
                }
            });
            return;
        }
        
        Notification.getSpecific(userId,entityId,type, function (result) {
            res.json(result);
        });
    },
    getByType: function (req, res) {
        var type = req.body.type || '';
        var userId = req.user._id || '';
        // validation       
        if (type == '' || !GLOBAL.enums.notificationTypes[type]) {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for get notification function"
                }
            });
            return;
        }
        
        Notification.getByType(userId,type, function (result) {
            res.json(result);
        });
    },
};

module.exports = notification;