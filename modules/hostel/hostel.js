var organizationModel = require('../../models/organization/organizationModel');
var hostelModel = require('../../models/organization/hostelModel');

var errorEnum = GLOBAL.enums.errorTypes;
var roleEnum = GLOBAL.enums.userRoles;

var hostel = {
    add: function (hostel, cb) {
        // first find if organization exists.
        organizationModel.findOne({ '_id': hostel.organization }, function (err, organization) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            // if organization does not exist, return. do not add hostel
            if (!organization) {
                cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
                return;
            }
            var host = new hostelModel(hostel);
            // save hostel.
            host.save(function (err, obj) {
                if (err) {
                    cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                    return;
                }
                
                // add hostel to organization
                organization.hostels.push(obj._id);
                
                organization.save(function (err, orgObj) {
                    if (err) {
                        cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                        return;
                    }
                    
                    console.log("add hostel: system saved", obj._id);
                    cb({ result : obj });

                });

                
            });
        });
    },
    addUserToHostel: function (hostelId, userId, cb) {
        console.log('addUserToHostel', hostelId, userId);
        hostelModel.update({ _id: hostelId }, { $push: { users: userId } }, function (err, hostel) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            if (!hostel) {
                cb({ err: { code: errorEnum.wrongDetails.code , msg: errorEnum.wrongDetails.msg } });
                return;
            }
            
            cb({ result: true });
        });

        //hostelModel.findOne({ '_id': hostelId }, function (err, hostel) {
            
        //    if (err) {
        //        cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
        //        return;
        //    }
            
        //    if (!hostel) {
        //        cb({ err: { code: errorEnum.wrongDetails.code , msg: errorEnum.wrongDetails.msg } });
        //        return;
        //    }
            
        //    hostel.users.push(userId);
            
        //    hostel.save(function (err, obj) {
        //        if (err) {
        //            cb({ code: errorEnum.partialInsert.code , msg: err });
        //            return;
        //        }
        //        else {
        //            cb({ result: true });
        //        }
        //    });

        //});
    },
    get: function (id, cb) {
        hostelModel
        .findOne({ '_id': id })
        .populate('organization')
        .exec(function (err, hostel) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            if (!hostel) {
                cb({ err: { code: errorEnum.wrongDetails.code , msg: errorEnum.wrongDetails.msg } });
                return;
            }
            
            cb({ result: hostel });

        });
    },
    getClientIds: function (hostelId, clientType, cb) {
        var matchQuery = {};
        cb(makeDestinationQueryObject(clientType));
        // TODO :: 
        // create a match query builder function that gets an object from makeDestinationQueryObject()
        // and makes a match query object.
        return;

        hostelModel
        .findOne({ '_id': hostelId })
        .populate({
            path: 'users',
            match: {
                role: { $eq: clientType }
            },
            select: '_id',
        })
        .select('users')
        .exec(function (err, hostel) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            if (!hostel) {
                cb({ err: { code: errorEnum.wrongDetails.code , msg: errorEnum.wrongDetails.msg } });
                return;
            }
            
            // map on users array and make new array of clients only.
            var clients = hostel.users.map(function (client) {
                return client._id;
            });
            
            cb({ result: clients });

        });
    },
    addApartment: function (aptObj, hostelId, cb) {
        hostelModel.update({ _id: hostelId }, { $push: { apartments: aptObj } }, function (err, newApt) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            if (!newApt) {
                cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
                //cb(error.make(errorEnum.mongoObjNotExist, null));
                return;
            }
            
            cb({ result: newApt.electionId });
        });
    },
    getAllApartments: function (hostelId, cb) {
        hostelModel
        .find({ '_id': hostelId })
        .lean()
        .select('apartments')
        .exec(function (err, apartments) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            if (!apartments) {
                cb({ err: { code: errorEnum.wrongDetails.code , msg: errorEnum.wrongDetails.msg } });
                return;
            }
            
            cb({ result: apartments });

        });
    },
    getOneApartment: function (hostelId, aptId, cb) {
        hostelModel
        .findOne({ '_id': hostelId, 'apartments._id': aptId })
        .select('apartments')
        .exec(function (err, obj) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            if (!obj) {
                cb({ err: { code: errorEnum.wrongDetails.code , msg: errorEnum.wrongDetails.msg } });
                return;
            }
            
            var apartment = obj.apartments.filter(function (apt) {
                return apt._id == aptId;
            });
            
            cb({ result: apartment });
        });
    },
};
// make a match query according to request.
// destination can be a single string or an array of strings
// each string can be either an id or a type.
// this function needs to figure out which is what and make the mongo query
var makeDestinationQueryObject = function (destination) {
    var destinationObj = {};
    var roleTypes = [];
    var ids = [];
    var utils = require('../utils/commonUtils.js');
    var mongoose = require('mongoose');
    // is destination an array
    console.log('destination', utils.isString(destination));
    if (utils.isArray(destination)) {
        destinationObj.isArray = true;
        // check every index in the array if it is an ID or a role.
        for (var i in destination) {
            var curr = destination[i];
            // check if curr is a valid role
            if (roleEnum[curr] != undefined) {
                roleTypes.push(curr);
                continue;
            }
            // check if curr is a valid id.
            if (mongoose.Types.ObjectId.isValid(curr)) {
                ids.push(curr);
                continue;
            }
        }
        destinationObj.roles = roleTypes;
        destinationObj.ids = ids;
        return destinationObj;
    } else if(utils.isString(destination)) {
        destinationObj.isArray = false;
        if (mongoose.Types.ObjectId.isValid(destination))
            ids.push(destination)
        else if (roleEnum[destination] != undefined)
            roleTypes.push(destination)

        destinationObj.roles = roleTypes;
        destinationObj.ids = ids;
        return destinationObj;
    }

    return null;
}

module.exports = hostel;