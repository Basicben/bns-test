var moment = require('moment');


function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

function isArray(obj) {
    return Array.isArray(obj);
}

function isString(obj) {
    return typeof obj === 'string';
}

function getFirstDayOfWeek() {
    return moment().startOf('week');
}

function getLastDayOfWeek() {
    return moment().endOf('week');
}
// this function returns boolean flag
// about wether one user can send to another.
// you should call this function in case
// a hierarchy is important and privacy is important

function isAllowedToOperate(fromId, fromRole, fromHostelId, aptId, destinationId, cb) {
    var isDestinationArray = Array.isArray(destinationId);
    
    if (!isDestinationArray && fromId == destinationId) {
        cb(true);
        return;
    }
    
    if (fromRole == 'client') {
        cb(false);
        return;
    }
    
    // get both users.
    var Users = require('../users/users.js');
    // get clients of the user "from"
    Users.getMyClients(fromHostelId, aptId, function (res) {
        //console.log('hostel:', fromHostelId);
        //console.log('aptId:', aptId);
        //console.log('result:', res.result);
        
        var clients = res.result;
        if (!clients || clients.length == 0) {
            cb(false);
            return;
        }
        
        function isClientExist(array, id) {
            var afterFilter = array.filter(function (obj) {
                if (obj._id == id)
                    return obj;
            });
            
            if (!afterFilter || afterFilter.length == 0) {
                return null;
            }
            // 0 because it is always a single result.
            return afterFilter[0];
        }
        
        if (isDestinationArray) {
            // if destination is an array
            // iterate through its clients
            // if you find a single inequality, return false.
            for (var i = 0; i < destinationId.length; i++) {
                
                var clientAfterFilter = isClientExist(clients, destinationId[i]);
                
                if (!clientAfterFilter) {
                    cb(false);
                    return;
                }
            }
            cb(true);
        } else {
            
            // find 
            var clientAfterFilter = isClientExist(clients, destinationId);
            
            !clientAfterFilter ? cb(false) : cb(true);

        }
        
    });
}

var commonUtils = {
    'expiresIn': expiresIn,
    'isArray': isArray,
    'isString': isString,
    'isAllowedToOperate': isAllowedToOperate,
    'lastDayOfWeek': getLastDayOfWeek,
    'firstDayOfWeek': getFirstDayOfWeek
};

module.exports = commonUtils;