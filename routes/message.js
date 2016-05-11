var Message = require('../modules/notifications/message.js');
var HOSTEL = require('../modules/hostel/hostel.js');
var sa = require('../sockets/index.js').actions;

var notificationTypes = GLOBAL.enums.notificationTypes;

var message = {
    broadcastMessage: function (req, res){
        var obj = req.body.message || '';
        var sentBy = req.user._id;
        var hostel = req.user.hostel;
        // validation       
        if (!validateBroadcastMessage(obj) || sentBy == '' || hostel == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for broadcastMessage function"
                }
            });
            return;
        }
        
        obj.sentBy = sentBy;
        obj.hostel = hostel;

        Message.broadcastMessage(obj, function (result) {
            // return survey object validation
            if (!result.err) {
                var Notification = require('../modules/notifications/notifications.js');
                // get all clients and send them a notification
                HOSTEL.getClientIds(req.user.hostel, obj.destinationRole, function (clients) {
                    if (!clients.err) { 
                        var notification = {
                            hostel: result.result.hostel,
                            from: result.result.sentBy,
                            _object: {
                                content: result.result.content,
                                createDate: result.result.createDate,
                            },
                            entityId: result.result._id,
                            type: notificationTypes.broadcastMessage.name,
                        };
                        Notification.add(notification, clients.result);
                        //sa.sendNotification(req.user.hostel, clients.result, notificationTypes.survey.name, function () { })
                    }
                });
            }         
            
            res.json(result);
        });
    },
};

var validateBroadcastMessage = function (obj) { 
    if (!obj)
        return false;
    if(!obj.destinationRole || obj.destinationRole == '')
        return false;
    if (!obj.content || obj.content == '')
        return false;
    
    return true;
}



module.exports = message;