var cu = require('./utils/commonUtils.js');
var jwt = require('jwt-simple');
var moment = require('moment');
var userModel = require('../models/users/userModel');
var PBKDF2 = require('../middleware/hash/pbkdf2');
var userForgotPasswordModel = require('../models/users/userForgotPasswordModel');
var loginLogs = require('./logs/login.js');
var passwordLogs = require('./logs/password.js');

var User = require('./users/users.js');
var cacheManager = require('./cache/cacheManager.js');

var errorEnum = GLOBAL.enums.errorTypes;
var loginLogEnum = GLOBAL.enums.logs.login;


var login = {
    login: function (username, password, isRemember, ip, isAdmin, cb) {
        userModel.findOne({ $or: [{ email: username } , { id: username }] }, function (err, userObj) {
            // email regex
            var isEmailReg = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
            
            // if input is email
            var isInputEmail = isEmailReg.test(username);
            
            // on error return generic 
            if (err) {
                loginLogs.add(ip, isInputEmail ? username : null, GLOBAL.enums.logs.login.failed, !isInputEmail ? username : null);
                cb({ err: { code: errorEnum.mongoErr.code, msg: err } });
                return;
            }
            
            if (!userObj) {
                loginLogs.add(ip, isInputEmail ? username : null, GLOBAL.enums.logs.login.failed, !isInputEmail ? username : null);
                cb({ err: { code: errorEnum.login.wrongUsername.code, msg: errorEnum.login.wrongUsername.msg } });
                return;
            }
            
            // if is admin == true and there is no role || role != admin, return error
            if (isAdmin && (!userObj.role || userObj.role != GLOBAL.enums.userRoles.admin.name)) {
                loginLogs.add(ip, isInputEmail ? username : null, GLOBAL.enums.logs.login.failed, !isInputEmail ? username : null);
                cb({ err: { code: errorEnum.noAuthorization.code, msg: errorEnum.noAuthorization.msg } });
                return;
            }
            
            // encrypt client password.
            PBKDF2.encryptWithSalt(password, userObj.salt, function (err, passwordObj) {
                
                if (err) {
                    loginLogs.add(ip, userObj.email, GLOBAL.enums.logs.login.mongoError, userObj._id);
                    cb({ err: { code: errorEnum.mongoErr.code, msg: err } });
                    return;
                }
                
                if (passwordObj.hash == userObj.password) {
                    // login succseeded
                    // create jwt
                    var token = genToken(userObj);
                    
                    var result = {
                        token : token,
                        _id: userObj._id,
                        id: userObj.id,
                        email: userObj.email,
                        hostel: userObj.hostel,
                        firstName: userObj.firstName,
                        lastName: userObj.lastName,
                        role: userObj.role,
                        apartment: userObj.apartment,
                        name: userObj.firstName + ' ' + userObj.lastName,
                    };
                    
                    if (isRemember)
                        result['refreshToken'] = userObj.refreshToken;
                    
                    cb({ result: result });
                    
                    // create login log.
                    loginLogs.add(ip, result.email, GLOBAL.enums.logs.login.success, result.userId);
                    cacheManager.addUserToCache(result);
                } else {
                    // if here, bad login
                    loginLogs.add(ip, userObj.email, GLOBAL.enums.logs.login.failed, userObj._id);
                    cb({ err: { code: errorEnum.login.wrongPassword.code, msg: errorEnum.login.wrongPassword.msg } });
                    return;
                }
            });
        });
    
    },
    validate: function (token, cb) {
        var decoded = jwt.decode(token, require('../config/secret.js')());
        var exp = moment(decoded.exp);
        if (exp.isAfter()) {
            var userObj = cacheManager.getUserFromCache(decoded._id);
            // if no user is in cache, get user, add to cache and return user obj.
            if (!userObj) {
                // get user from db.
                User.get(decoded._id, function (res) {
                    cb({ status: true, user: res });
                });
                return;
            }
            cb({ status: true, user: userObj });
        }
        else
            cb({ status: false, user: null });

    },
    forgotPassword: function (username, cb) {
        console.log('username', username);
        userModel.findOne({ $or: [{ email: username } , { id: username }] }, function (err, userObj) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code, msg: err } });
                return;
            }
            
            if (!userObj) {
                cb({ err: { code: errorEnum.mongoObjNotExist.code, msg: errorEnum.mongoObjNotExist.msg } });
                return;
            }
            
            var obj = {
                user: userObj._id,
                token: PBKDF2.getRandomBytes(),
                expirationDate: cu.expiresIn(1),
                isActive: true
            }
            
            var ufp = new userForgotPasswordModel(obj);
            
            ufp.save(function (err, obj) {
                if (err) {
                    cb({ err: { code: errorEnum.mongoErr.code, msg: err } });
                }
                else {
                    var mail = require('../middleware/mail/mail.js');
                    var mailHtml = "<div> this link is for reseting your password </br> <a href='http://localhost:3090/login/forgot?fpid=" + ufp.token + "'>click here</a> </div>";
                    mail.send(userObj.email, "BNS Reset Passowrd", mailHtml);
                    cb({ result : true });
                }
            });

        })
    },
    validateForgotPasswordToken: function (token, cb) {
        userForgotPasswordModel.findOne({ "token" : token , "isActive" : true }, function (err, forgotPasswordObj) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code, msg: err } });
                return;
            }
            
            if (!forgotPasswordObj) {
                cb({ result : false });
                return;
            } else {
                cb({ result : true });
                return;
            }
        });
    },
    changePassword: function (token, password, cb) {
        userForgotPasswordModel.findOne({ "token" : token , "isActive" : true }, function (err, forgotPasswordObj) {
            
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code, msg: err } });
                return;
            }
            
            if (!forgotPasswordObj) {
                cb({ err: { code: errorEnum.wrongToken.code, msg: errorEnum.wrongToken.msg } });
                return;
            }
            
            var exp = moment(forgotPasswordObj.expirationDate);
            
            if (exp.isAfter()) {
                userModel.findOne({ "_id" : forgotPasswordObj.user }, function (err, userObj) {
                    PBKDF2.encrypt(password, function (err, userPasswordInfo) {
                        
                        if (!userPasswordInfo || !userObj) {
                            cb({ err: { code: errorEnum.mongoErr.code, msg: 'Forgot password Object failed. ' + err } });
                            return;
                        }
                        
                        // remember old password.
                        var oldPassword = userObj.password;
                        
                        userObj.salt = userPasswordInfo.salt;
                        userObj.password = userPasswordInfo.hash;
                        
                        function userObjSaveCallback(err, obj) {
                            if (err) {
                                cb({ err: { code: errorEnum.mongoErr.code, msg: err } });
                                return;
                            }
                            
                            cb({ result: true });
                            // create change password log user (userId), new password, old password 
                            passwordLogs.add({ user: userObj._id, newPassword: userPasswordInfo.hash, oldPassword: oldPassword });
                            
                            forgotPasswordObj.isActive = false;
                            forgotPasswordObj.save(function (err, obj) {
                                if (err) {
                                    cb({ err: { code: errorEnum.mongoErr.code, msg: 'Forgot password Object failed. ' + err } });
                                    return;
                                }
                            });
                        }
                        
                        userObj.save(userObjSaveCallback);
                    });
                });
            } else {
                cb({ err: { code: errorEnum.tokenExpired.code, msg: errorEnum.tokenExpired.msg } });
                return;
            }

        });
    },
}

// private method
function genToken(user) {
    var expires = cu.expiresIn(7); // 7 days
    var token = jwt.encode({
        _id: user._id,
        exp: expires,
        email: user.email,
        token: user.refreshToken,
        role: user.role,
        hostel: user.hostel,
        apartment: user.apartment ? user.apartment : '',
        // apartment: user.apartment,
        // all user additional info.
        // roleLevel: user.roleLevel
    }, require('../config/secret')());
    
    return {
        token: token,
        expires: expires
    };
}

module.exports = login;