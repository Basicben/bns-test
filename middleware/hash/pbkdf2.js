var crypto = require('crypto');
var Buffer = require('buffer');

var pbkdf2 = {
    encrypt: function (pass, cb) {
        crypto.randomBytes(128, function (err, salt) {
            if (err)
                cb(err, null);
            salt = salt.toString('hex');
            crypto.pbkdf2(pass, salt, 7000, 128, function (err, hash) {
                if (err)
                    cb(err, null);
                
                cb(err, {
                    salt : salt, 
                    hash : hash.toString('hex')
                });
            });
        });
    },
    encryptWithSalt: function (pass, salt, cb) {
        crypto.pbkdf2(pass, salt, 7000, 128, function (err, hash) {
            if (err)
                cb(err, null);
            
            cb(err, {
                salt : salt, 
                hash : hash.toString('hex')
            });
        });
    },
    getRandomBytes: function () {
        var token = crypto.randomBytes(128).toString('hex');
        return token;
    }
};

module.exports = pbkdf2;