var notificationModel = require('../../models/notifications/notificationModel');
var cu = require('../utils/commonUtils.js');

var notificationTypes = GLOBAL.enums.notificationTypes;
var errorEnum = GLOBAL.enums.errorTypes;
var error = require('../errors.js');


var notifications = {
    getSpecific: function (userId, entityId, type, cb) {
        // get notification by entity id and type.
        // if we dont get the right type we would not know which collection to address
        
        // load the right schema model according to notification type
        var model = require('../../' + notificationTypes[type].modelUrl);
        // get notification by id
        console.log('entityId,type', entityId, type);
        //console.log('../../models/' + notificationTypes[type].modelUrl);
        model.findOne({ 'to': userId, '_id': entityId }, function (err, notification) {
            
            if (err) {
                cb(error.make(null, err));
                return;
            }
            
            if (!notification) {
                cb(error.make(errorEnum.mongoObjNotExist, null));
                return;
            }
            
            cb({ result: notification });
        });
    },
    getByType: function (userId, type, cb) {
        // get notification by id
        notificationModel.find({ 'user': userId, 'type': type }, function (err, notifications) {
            
            if (err) {
                cb(error.make(null, err));
                return;
            }
            
            if (!notifications) {
                cb(error.make(errorEnum.mongoObjNotExist, null));
                return;
            }
            
            cb({ result: notifications });

        });
    },
    get: function (userId, cb) {
        
        notificationModel
        .find({ 'to': userId })
        .sort('-createDate')
        .exec(function (err, notifications) {
            if (err) {
                cb(error.make(null, err));
                return;
            }
            
            if (!notifications) {
                cb(error.make(errorEnum.mongoObjNotExist, null));
                return;
            }
            // count new notification callback
            function notificationCountCallback(err, count) {
                if (err) { 
                    
                }
                console.log('there are %d new notification', count);
                cb({ result: notifications, new: count });
            }
            // get sum of new notifictions.
            notificationModel.count({ 'to': userId, 'isRead': false }, notificationCountCallback);
        });
    },
    add: function (notification, clients) {
        // add new notification to notification center
        console.log('notification', notification);
        console.log('clients', clients);
        if (cu.isArray(clients)) {
            // bulk object creation.
            var notifications = clients.map(function (userId) {
                var nObj = {
                    hostel: notification.hostel,
                    from: notification.from,
                    _object: notification._object,
                    to: userId,
                    entityId: notification.entityId,
                    type: notification.type,
                };
                return nObj;
            });
            
            // insert all of the notifiction bulk into notification db
            notificationModel.collection.insert(notifications, function (err, docs) {
                if (err) {
                    cb(error.make(errorEnum.partialInsert, null));
                }
                var sa = require('../../sockets/index.js').actions;
                // send notification to online users.
                sa.sendNotification(notification.hostel, clients, notification.type, notification._object, function () { });
            });
        } else {
            notification.to = clients;
            var not = notificationModel(notification);
            not.save(function (err, notObj) {
                if (err) {
                    cb(error.make(errorEnum.partialInsert, null));
                    return;
                }
                cb({ result: true });
            });
        }
    },
    send: function () { 
        // send notification to its user.
    },
    delete: function () { 
        
    },
    changeStatus: function () { 
        // this function changes the status of the isNew param in notification.
    },
};
module.exports = notifications;
