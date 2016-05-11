var connectedUsers = require('../globals.js').connectedUsers;

// module_command
var socketRoute = {
    'getData' : '',
    'sort' : '',
    'filter' : '',
    'action' : ''
};

var emitSocket = null;

function index(socket) {
    // get a general socket for emit functions
    emitSocket = socket;
    
    console.log('Socket Connection Has Been Established');
    
    // user connect socket
    socket.on('userStatus', function (data) {
        //console.log('USER STATUS\n\ndata : ', data.isConnect, data.user);
        
        // validation
        if (!data.user || !data.user._id || data.user._id == '' || !data.user.hostel)
            return;
        
        if (data.isConnect) {
            // if here user connect
            console.log('User has connected. Turn his status to online', data.user._id);
            // set new user to connected users.
            connectedUsers.add(data.user);
            // fire emit to clients (of the same hostel) about new online user.
            //socket.emit('newOnlineUser', data.user);
        } else {
            var userId = data.user._id;
            // delete user from dictionary
            if (connectedUsers[userId])
                delete connectedUsers[userId];
            // fire emit to clients (of the same hostel) about offline user.
            //socket.emit('newOfflineUser', 'user offline');
        }
    });
    
    // user disconnect socket
    socket.on('disconnect', function (userId,hostelId) {
        console.log('Socket Connection Has Been Terminated');
        emitSocket = null;
    });

};

var errorEnum = require('../enum/enum.js').errorTypes;
var cu = require('../modules/utils/commonUtils.js');
var connectedUsers = require('../globals.js').connectedUsers;
var notificationTypes = GLOBAL.enums.notificationTypes;

// all personal user emit actions.
var actions = {
    // send new notification to specific user.
    sendNotification: function (hostelId, users,notificationType,obj, cb) {
        
        // param validation
        if (hostelId == '' || !users || users == '' || !notificationTypes[notificationType]) {
            cb({ err: { code: errorEnum.socket.wrongDetails.code , msg: errorEnum.socket.wrongDetails.msg } });
            return;
        }
        
        // emit global socket variable validation
        if (!emitSocket) {
            cb({ err: { code: errorEnum.socket.noConnection.code , msg: errorEnum.socket.noConnection.msg } });
            return;
        }
        
        // TODO::
        // make a socket return object
        // depending on notificationType
        // which notification to send.
        
        console.log('Sending notification type', notificationType, 'to', users,'from hostel',hostelId);

        // array can also be send in case of multipule users
        if (cu.isArray(users)) {
            // is user connected validation to system at the moment
            users = connectedUsers.getConnected(hostelId, users);
            if (users.length == 0)
                return;

            for (var i = 0; i < users.length; i++) {
                console.log('Sending notification_' + users + ' to users ', users[i], ' from hostel : ', hostelId);
                emitSocket.emit('notification_' + users[i], obj);
            }

        } else if (cu.isString(users)) {
            // is user connected validation to system at the moment
            if (!connectedUsers.isConnected(hostelId, users))
                return;

            console.log('sendNotification.\nSending' + 'notification_' + users + ' notification to hostel : ', hostelId,' user :', users);
            emitSocket.emit('notification_' + users, obj);
        } else {
            if (cb)
                cb({ err: { code: errorEnum.socket.wrongDetails.code , msg: errorEnum.socket.wrongDetails.msg } });
            return;
        }
        
        if (cb)
            cb({ result: { status: true, msg: 'notification successfully sent' } });
    },
    sendMessage: function (userId, cb) {
        
        if (!emitSocket) {
            cb({ err: { code: errorEnum.socket.noConnection.code , msg: errorEnum.socket.noConnection.msg } });
            return;
        }
        // array can also be send in case of multipule users
        if (cu.isArray(userId)) {
            for (var i = 0; i < userId.length; i++)
                emitSocket.emit('message_' + userId, 'message content');
        }
        else if (cu.isString(userId)) {
            emitSocket.emit('message_' + userId, 'message content');
        }

        if (cb)
            cb({ result: { status: true, msg: 'message successfully sent' } });
    },
    sendGroupMessage: function (user, cb) {
        if (!emitSocket) {
            cb({ err: { code: errorEnum.socket.noConnection.code , msg: errorEnum.socket.noConnection.msg } });
            return;
        }
        
        // array can also be send in case of multipule users
        if (cu.isArray(userId)) {
            for (var i = 0; i < userId.length; i++)
                emitSocket.emit('message_' + userId, 'message content');
        }
        else if (cu.isString(userId)) {
            emitSocket.emit('message_' + userId, 'message content');
        }

        if (cb)
            cb({ result: { status: true, msg: 'message_ successfully sent' } });
    }
};

module.exports = {
    index: index,
    actions: actions,
};
