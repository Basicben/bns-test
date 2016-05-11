var HOSTEL = require('../modules/hostel/hostel.js');

var hostel = {
    add: function (req, res) {
        var hostel = req.body.newHostel || '';
        var userId = req.user._id || '';
        // validation       
        if (!validateHostel(hostel) || userId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add hostel function"
                }
            });
            return;
        }
        // set createdBy attribute.
        hostel.createdBy = userId;
        HOSTEL.add(hostel, function (result) { 
            res.json(result);
        });

    },
    addUserToHostel: function (req, res) {
        // get params
        var hostelId = req.body.hostelId || '';
        var userId = req.body.userId || '';
        var role = req.body.role || '';

        // validation
        if (userId == '' || hostelId == '' || role == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user client function"
                }
            });
            return;
        }

        HOSTEL.addUserToHostel(hostelId,userId, role, function (result) {
            res.json(result);
        });

    },
    get: function (req, res) {
        var id = req.user.hostel || '';
        
        if (id == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for get hostel function"
                }
            });
            return;
        }
        
        HOSTEL.get(id, function (result) {
            res.json(result);
        });

    },
    getClientIds: function (req, res) {
        var hostelId = req.user.hostel || '';

        if (hostelId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for get hostel function"
                }
            });
            return;
        }

        HOSTEL.getClientIds(hostelId,['guide','manager','asdasd','56dcaa1cff02df3026a3dbfd'],function (result) { 
            res.json(result);
        });

    },
    addApartment: function (req, res) {
        var apartment = req.body.apartment || '';
        var hostelId = req.user.hostel || '';
        
        // validation       
        if (!validateApartment(apartment) || hostelId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add hostel function"
                }
            });
            return;
        }
        
        HOSTEL.addApartment(apartment, hostelId, function (result) {
            res.json(result);
        });
    },
    getAllApartments: function (req, res) {
        var hostelId = req.user.hostel || '';
        // validation       
        if (hostelId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add hostel function"
                }
            });
            return;
        }
        HOSTEL.getAllApartments(hostelId, function (result) {
            res.json(result);
        });
    },
    getOneApartment: function (req, res) {
        var aptId = req.body.aptId || '';
        var hostelId = req.user.hostel;
        // validation       
        if (hostelId == '' || aptId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for get apartment function"
                }
            });
            return;
        }
        HOSTEL.getOneApartment(hostelId, aptId, function (result) {
            res.json(result);
        });
    },
    getMyApartment: function (req, res) {
        var aptId = req.user.apartment || '';
        var hostelId = req.user.hostel || '';
        // validation       
        if (hostelId == '' || aptId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for get apartment function"
                }
            });
            return;
        }
        HOSTEL.getOneApartment(hostelId, aptId, function (result) {
            res.json(result);
        });
    },
};

// validate if all hostel fileds are available
var validateHostel = function (hostelObj) {
    
    if (!hostelObj)
        return false;
    if (!hostelObj.organization || hostelObj.organization == '')
        return false;
    if (!hostelObj.name || hostelObj.name == '')
        return false;
    if (!hostelObj.timezone || hostelObj.timezone == '')
        return false;
    
    return true;
}
// validate if all apartment fileds are available
var validateApartment = function (aptObj) {
    if (!aptObj)
        return false;
    if (!aptObj.name)
        return false;
    
    return true;
}

module.exports = hostel;