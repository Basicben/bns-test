var organizationModel = require('../../models/organization/organizationModel');

var errorEnum = GLOBAL.enums.errorTypes;
var error = require('../errors.js');

var organization = {
    add: function (orgObj, cb) {
        
        var org = new organizationModel(orgObj);
        org.save(function (err, obj) {
            if (err) {
                cb(error.make(null, err));
                return;
            }
            
            cb({ result : obj });
        });

    },
    get: function (hostelId, cb) {
        // create query accordingly.
        organizationModel.findOne({ hostels: { $in : [hostelId] } }, function (err, docs) {
            
            if (err) {
                cb(error.make(null, err));
                return;
            }
            
            cb({ result : docs });

        });
        
    },
    getWithHierarchy: function (id, cb) {
        // create query accordingly.
        var query = id == '' ? {} : { '_id': id };
        
        // get all hierarchy of organization.
        organizationModel
            .find(query)
            .populate('hostels')
            .exec(function (err, orgObj) {
            if (err) {
                cb(error.make(null, err));
                return;
            }
            
            if (!orgObj) {
                cb(error.make(errorEnum.wrongDetails, null));
                return;
            }
            
            cb({ result: orgObj });
        });
    },
};

module.exports = organization;