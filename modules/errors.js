var errorTypes = GLOBAL.enums.errorTypes;

var error = {
    make: function (type, err) {
        if (!type || type == '' || !errorTypes[type])
            return { err: { code: errorTypes.mongoErr.code , msg: err || '' } };
        
        return { err: { code: errorTypes[type].code , msg: errorTypes[type].msg } };
        
    }
};

module.exports = error;