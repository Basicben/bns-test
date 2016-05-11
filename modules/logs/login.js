var loginHistoryModel = require('../../models/logs/loginHistoryModel.js');
var IpInfo = require("ipinfo");

var getInfoByIp = function (ip, cb) {
    if (ip == null || ip == '')
        cb(null);
    
    IpInfo(ip, function (err, cLoc) {
        if (err) cb(null);
        if (cLoc) {
            //cLoc = JSON.parse(cLoc);
            cb({
                country: cLoc.country,
                city: cLoc.city,
            });
        }
    });
}

var loginLogs = {
    add: function (ip, email,status,userId) { 

        // ip regex.
        var IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        
        // create login log object
        var obj = {
            ip: IP_REGEX.test(ip) ? ip : null, 
            status: status,
            email: email,
            id: userId != '' ? userId : null,
        };
        
        // send obj.ip
        getInfoByIp(obj.ip, function (location) {
            // create new log model schema
            console.log('obj.', obj);
            if (location && obj.city && log.country)
                obj.location = location;
            
            var log = loginHistoryModel(obj);
            
            // save model.
            log.save(function (err, obj) {
                if (err) {
                    console.log('Log has not been saved', log);
                    return;
                }
            });
        });

    },
    get: function () { 
        return true;
    },
};

module.exports = loginLogs;