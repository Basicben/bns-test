var jwt = require('jwt-simple');
var userModel = require('../../models/users/userModel');
var timetableModel = require('../../models/timetable/timetableModel');
var HOSTEL = require('../hostel/hostel');
var PBKDF2 = require('../../middleware/hash/pbkdf2');

var typesEnum = GLOBAL.enums.userRoles;
var errorEnum = GLOBAL.enums.errorTypes;    // error enum
var error = require('../errors.js');

var cu = require('../utils/commonUtils.js');
var cacheManager = require('../cache/cacheManager.js');

var users = {
    get: function (userId, cb) {
        userModel
        .findOne({ "_id" : userId, "isActive": true })
        //.populate('clients')
        //.populate('hostel')
        .select('-password -salt -isActive')
        .lean()
        .exec(function (err, userObj) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            if (!userObj) {
                cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
                return;
            }
            
            var usr = userObj;
            usr.name = userObj.firstName + ' ' + userObj.lastName;
            cb({ result: usr });
            cacheManager.addUserToCache(userObj);
        });
    },
    getMyClients: function (hostelId, apartmentId, cb) {
        userModel
            .find({ 'hostel': hostelId, 'apartment': apartmentId, 'role': { $eq: typesEnum.client.name } })
            .select('-refreshToken -password -salt')
            .exec(function (err, residents) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            cb({ result: residents });
        });
    },
    getUsersByType: function (hostelId, role, cb) {
        userModel
            .find({ 'hostel': hostelId, 'role': { $eq: role } })
            .select('-refreshToken -password -salt')
            //.sort('role')
            .exec(function (err, docs) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            cb({ result: docs });
        });
    },
    getUsersBeneath: function (role, hostelId, apartmentId, cb) {
        
        if (role == typesEnum.guide.name) {
            if (!apartmentId || apartmentId == '') {
                res.status(401);
                res.json({
                    err: {
                        "status": 401,
                        "message": "Invalid data for add user client function"
                    }
                });
                return;
            }
            users.getMyClients(hostelId, apartmentId, cb);
            return;
        }
        
        userModel
            .find({ 'hostel': hostelId, $or: [{ 'role': { $eq: typesEnum.guide.name } }, { 'role': { $eq: typesEnum.client.name } }] })
            .sort('role')
            .exec(function (err, docs) {
            if (err) {
                cb(error.make(null, err));
                return;
            };
            
            //assert(Array.isArray(docs));
            cb({ result: docs });
        });
    },
    addClient: function (user, cb) {
        users.add(user, typesEnum.client, cb);
    },
    addGuide: function (user, cb) {
        HOSTEL.getOneApartment(user.hostel, user.apartment, function (res) {
            if (res.err || !res.result) {
                res.status(401);
                res.json({
                    err: {
                        "status": 401,
                        "message": "Invalid data for add user function"
                    }
                });
                return;
            }
            users.add(user, typesEnum.guide, cb);
        });
    },
    addManager: function (user, cb) {
        users.add(user, typesEnum.manager, cb);
    },
    addAdmin: function (user, cb) {
        users.add(user, typesEnum.admin, cb);
    },
    add: function (user, role, cb) {
        console.log('user',user);
        var cre = new userModel(user);
        cre.role = role.name;
        
        PBKDF2.encrypt(cre.password, function (err, userPasswordInfo) {
            
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            if (!userPasswordInfo) {
                cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
                return;
            }
            // set encrypted params
            cre.salt = userPasswordInfo.salt;
            cre.password = userPasswordInfo.hash;
            cre.refreshToken = PBKDF2.getRandomBytes();
            
            cre.save(function (err, obj) {
                if (err) {
                    cb({ err: { code: errorEnum.partialInsert.code , msg: errorEnum.partialInsert.msg } });
                    return;
                }
                
                // if admin, skip hostel insert
                if (role.value == GLOBAL.enums.userRoles.admin.value) {
                    cb({ result: obj });
                    return;
                }
                
                // add user to hostel
                HOSTEL.addUserToHostel(user.hostel, obj._id, function (response) {
                    if (response.err) {
                        cb({ err: { code: errorEnum.partialInsert.code , msg: response.err } });
                        return;
                    }
                    
                    if (!response.result) {
                        cb({ err: { code: errorEnum.partialInsert.code , msg: errorEnum.partialInsert.msg } });
                        return;
                    }
                    
                    cb({ result: obj });
                });
            });
        });
    },
    getByRefreshToken: function (refreshToken, cb) {
        userModel.findOne({ "refreshToken": refreshToken }, function (err, userObj) {
            if (err) {
                cb(error.make(null, err));
                return;
            }
            
            if (!userObj) {
                cb(error.make(errorEnum.wrongDetails, null));
                return;
            }
            
            cb({ result : userObj });
        });
    },
    update: function (userId, hostelId, options, cb) {
        
        var query = {
            '_id': userId
        };
        
        if (hostelId)
            query.hostel = hostelId;
        
        userModel.find(query, function (err, userObj) {
            if (err) {
                cb(error.make(null, err));
                return;
            }
            
            if (!userObj || !userObj.length) {
                cb(error.make(errorEnum.wrongDetails, null));
                return;
            }
            userObj = userObj[0];
            
            // if isActive equals false
            // "delete" user.
            if (options.isActive != undefined && options.isActive != null && options.isActive == false) {
                userObj.isActive = options.isActive;
                userObj.save();
                cb({ result : true });
                return;
            }
            
            if (options.firstName)
                userObj.firstName = options.firstName;
            if (options.lastName)
                userObj.lastName = options.lastName;
            if (options.dateOfBirth)
                userObj.birthday = options.dateOfBirth;
            if (options.phone)
                userObj.phone = options.phone;
            
            userObj.save();
            cb({ result : true });
        });
    },
    updateUser: function (parentId, userId, hostelId, aptId, role, options, cb) {
        
        function updateUserFunctionCallback(res) {
            
            if (!res) {
                cb({ err: { code: errorEnum.noAuthorization.code , msg: errorEnum.noAuthorization.msg } });
                return;
            }
            
            var query = {
                '_id': userId
            };
            
            if (hostelId)
                query.hostel = hostelId;
            
            userModel.find(query, function (err, userObj) {
                if (err) {
                    cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                    return;
                }
                
                if (!userObj || !userObj.length) {
                    cb({ err: { code: errorEnum.wrongDetails.code , msg: errorEnum.wrongDetails.msg } });
                    return;
                }
                userObj = userObj[0];
                
                // if isActive equals false
                // "delete" user.
                if (!isActive) {
                    userObj.isActive = options.isActive;
                    userObj.save();
                    cb({ result : true });
                    return;
                }
                
                if (options.firstName)
                    userObj.firstName = options.firstName;
                if (options.lastName)
                    userObj.lastName = options.lastName;
                if (options.dateOfBirth)
                    userObj.birthday = options.dateOfBirth;
                if (options.phone)
                    userObj.phone = options.phone;
                
                userObj.save();
                cb({ result : true });
            });

        }

        cu.isAllowedToOperate(parentId, role, hostelId, aptId, userId, updateUserFunctionCallback);

    },
}

module.exports = users;