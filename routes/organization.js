var ORGANIZATION = require('../modules/organization/organization.js');

var organization = {
    add: function (req, res) { 
        var organization = req.body.newOrganization || '';
        var userId = req.user._id || '';
        // validation
        if (!validateOrganization(organization) || userId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user client function"
                }
            });
            return;
        }
        //console.log('organization', organization);
        organization.createdBy = userId;
        ORGANIZATION.add(organization,function (result) { 
            res.json(result);
        });

    },
    getWithHierarchy: function (req, res) {
        var id = req.body.id || '';
        
        ORGANIZATION.getWithHierarchy(id,function (result) {
            res.json(result);
        });
    },
    get: function (req,res) {
        var id = req.user.hostel || '';      

        ORGANIZATION.get(id,function (result) { 
            res.json(result);
        });
    },
};

// validate if all hostel fileds are available
var validateOrganization = function (orgObj) {
    
    if (!orgObj)
        return false;
    if (!orgObj.name || orgObj.name == '')
        return false;
    
    return true;
}

module.exports = organization;