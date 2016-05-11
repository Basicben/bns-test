var broadcastMessageModel = require('../../models/notifications/broadcastMessageModel.js');

var errorEnum = GLOBAL.enums.errorTypes;

var message = {
    broadcastMessage: function (bmObj, cb) {
        var bm = new broadcastMessageModel(bmObj);
        
        bm.save(function (err, obj) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            cb({ result: obj });

        });
            
    },
};

module.exports = message;