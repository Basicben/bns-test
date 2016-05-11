var connectedUsersDictionary = {};

var connectedUsers = {
    add: function (user) {
        // add user to dictionary only if hostel OR user does not already exists.
        if (!connectedUsersDictionary[user.hostel]) {
            connectedUsersDictionary[user.hostel] = {};
        }
        
        if (connectedUsersDictionary[user.hostel][user._id] == undefined) {
            connectedUsersDictionary[user.hostel][user._id] = { _id: user._id, createDate: new Date() };
        }
        console.log('A new hostel has been added to connectedUsersDictionary', connectedUsersDictionary, '\n\n');

    },
    remove: function (hostelId, userId) {
        
        // deletion validation
        // verifies if hostelId exists in connected users.
        if (!connectedUsersDictionary[user.hostel])
            return;
        
        // delete connected user object if exists.
        if (connectedUsersDictionary[user.hostel][user._id]) {
            delete connectedUsersDictionary[user._id];
            console.log('A new user has been added to connectedUsersDictionary', user._id);
        }
                
    },
    getByHostel: function (hostelId) {
        return connectedUsersDictionary[hostelId];
    },
    isConnected: function (hostelId, userId) {
        return !connectedUsersDictionary[hostelId][userId] ? false : true;
    },
    getConnected: function (hostelId, users) {
        var arr = [];
        
        //if (connectedUsersDictionary[hostelId]) {
        //    for (user in connectedUsersDictionary[hostelId])
        //        arr.push(user);
        //}
        
        if (connectedUsersDictionary[hostelId]) {
            for (var i = 0; i < users.length; i++)
                if (connectedUsersDictionary[hostelId][users[i]])
                    arr.push(users[i]);
        }

        console.log('arrrrrrr', arr);
        return arr;
    }

}

module.exports = {
    connectedUsers: connectedUsers,
}