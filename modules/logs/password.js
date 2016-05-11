var changePasswordModel = require('../../models/logs/changePasswordModel.js');

var passwordLogs = {
    add: function (obj) {
        if (!validatePasswordObj(obj)) {
            // error occured, handle.
            console.log('error while validating password log obj');
        }

        var log = changePasswordModel(obj);
        
        // save model.
        log.save(function (err, obj) {
            if (err) {
                console.log('Log has not been saved');
                return;
            }
        });
    },
};

var validatePasswordObj = function (obj){
    if (!obj)
        return false;
    if (!obj.user)
        return false;
    if (!obj.newPassword)
        return false;
    if (!obj.oldPassword)
        return false;

    return true;
}

module.exports = passwordLogs;
