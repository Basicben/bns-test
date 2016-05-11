var moment = require('moment');

var cache = {
    users: {},
    expirationInMinutes: 30,
}

function getDateWithExpiration(){
    return moment().add(cache.expirationInMinutes,'minutes');
}

// TODO::
// make clean cache process.
// delete by cacheDateAdded.

var cacheManager = {
    addUserToCache: function (obj) {
        obj.cacheDateExpired = getDateWithExpiration();
        cache.users[obj._id] = obj;
        console.log('User has been added to cache', obj._id);
        
        // delete un needed cache.
        cacheManager.delete();
    },
    getUserFromCache: function (userId) {
        if (userId == '')
            return null;
        
        if (cache.users.length == 0 || !cache.users[userId])
            return null;
        
        // update last 
        cache.users[userId].cacheDateExpired = getDateWithExpiration();
        
        console.log('Get user has from cache', cache.users[userId]._id);
        return cache.users[userId];
    },
    delete: function () {
        if (Object.keys(cache.users).length == 0) {
            console.log('cache is already clean clean');
            return;
        }
        // 
        for (var key in cache.users) {
            var curr = cache.users[key];
            if (curr.cacheDateExpired <= moment()) {
                console.log('Delete user from cache', cache.users[key]._id);
                delete cache.users[key];
            }
        }
    }
}

module.exports = cacheManager;