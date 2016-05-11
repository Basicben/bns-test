var USERS = require('../modules/users/users.js');

var users = {
    get: function (req, res) {
        var userId = req.user._id || '';
        
        // delete this shit.
        //var role = 'admin';
        if (userId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user client function"
                }
            });
            return;
        }
        
        USERS.get(userId, function (obj) {
            res.json(obj);
        });

    },
    getUser: function (req, res) {
        var userId = req.user.userId || '';
        
        if (userId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user client function"
                }
            });
            return;
        }
        
        USERS.get(userId, function (obj) {
            res.json(obj);
        });

    },
    delete: function (req, res) {
        var userId = req.user._id || '';
        // var id = req.body.id || '';
        // validation
        if (userId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user admin function"
                }
            });
            return;
        }
        
        USERS.update(userId, null, null, null, null, null, false, function (obj) {
            res.json(obj);
        });
    },
    deleteUser: function (req, res) {
        var userId = req.body.userId || '';
        var hostelId = req.user.hostel || '';
        // var id = req.body.id || '';
        // validation
        if (userId == '' || hostelId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user admin function"
                }
            });
            return;
        }
        
        USERS.update(userId, hostelId, null, null, null, null, false, function (obj) {
            res.json(obj);
        });
    },
    getMyClients: function (req, res) {
        var guideId = req.user._id || '';
        var hostelId = req.user.hostel || '';
        // delete this shit.
        //var role = 'admin';
        if (guideId == '' || hostelId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user client function"
                }
            });
            return;
        }
        
        USERS.getMyClients(guideId, hostelId, function (obj) {
            res.json(obj);
        });

    },
    getAllGuides: function (req, res) {
        var hostelId = req.user.hostel || '';
        // delete this shit.
        //var role = 'admin';
        if (hostelId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user client function"
                }
            });
            return;
        }
        
        USERS.getUsersByType(hostelId, GLOBAL.enums.userRoles.guide.name, function (obj) {
            res.json(obj);
        });
    },
    getAllClients: function (req, res) {
        var hostelId = req.user.hostel || '';
        // delete this shit.
        //var role = 'admin';
        if (hostelId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user client function"
                }
            });
            return;
        }
        
        USERS.getUsersByType(hostelId, GLOBAL.enums.userRoles.client.name, function (obj) {
            res.json(obj);
        });
    },
    getUsersBeneath: function (req, res) {
        var role = req.user.role || '';
        var hostelId = req.user.hostel || '';
        var apartmentId = req.user.apartment || '';
       
        if (role == '' || hostelId == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user client function"
                }
            });
            return;
        }
        
        USERS.getUsersBeneath(role, hostelId, apartmentId, function (obj) {
            res.json(obj);
        });
    },
    addClient: function (req, res) {
        var user = req.body.newUser || '';
        var apartment = req.user.apartment || '';
        user.hostel = req.user.hostel || '';
        console.log(user, apartment);
        // validation        
        if (!validateUser(user) || user == '' || !apartment || apartment == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user client function"
                }
            });
            return;
        }
        user.apartment = apartment;
        USERS.addClient(user, function (obj) {
            res.json(obj);
        });
    },
    addGuide: function (req, res) {
        var user = req.body.newUser || '';
        user.hostel = req.user.hostel || '';
        // validation        
        if (!validateUser(user) || !user.apartment || user.apartment == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user guide function"
                }
            });
            return;
        }
        
        USERS.addGuide(user, function (obj) {
            res.json(obj);
        });
    },
    addManager: function (req, res) {
        var user = req.body.newUser || '';
        user.hostel = req.user.hostel || '';
        // validation        
        if (!validateUser(user) || user == '' || !user.hostel) {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user manager function"
                }
            });
            return;
        }
        
        USERS.addManager(user, function (obj) {
            res.json(obj);
        });
    },
    addAdmin: function (req, res) {
        var user = req.body.newUser || '';
        // validation
        if (user == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user admin function"
                }
            });
            return;
        }
        
        USERS.addAdmin(user, function (obj) {
            res.json(obj);
        });
    },
    update: function (req, res) {
        var userId = req.user._id || '';
        var hostelId = req.user.hostel || '';
        var options = req.body.options || '';
        // var id = req.body.id || '';
        // validation
        if (hostelId == '' || userId == '' || options == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user admin function"
                }
            });
            return;
        }
        
        USERS.update(userId, hostelId, options, function (obj) {
            res.json(obj);
        });
    },
    updateUser: function (req, res) {
        var userId = req.body.userId || '';
        var parentId = req.user._id || '';
        var hostelId = req.user.hostel || '';
        var role = req.user.role || '';
        var apartmentId = req.user.apartment || '';
        var options = req.body.options || '';
        // validation
        if (parentId == '' || userId == '' || role == '' || hostelId == '' || apartmentId == '' || options == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add user admin function"
                }
            });
            return;
        }
        
        USERS.updateUser(parentId, userId, hostelId, apartmentId, role, options, function (obj) {
            res.json(obj);
        });
    },
}

// validate if all user fileds are available
var validateUser = function (userObj) {
    if (!userObj)
        return false;
    if (!userObj.id || userObj.id == '')
        return false;
    if (!userObj.email || userObj.email == '')
        return false;
    if (!userObj.hostel || userObj.hostel == '')
        return false;
    if (!userObj.lastName || userObj.lastName == '')
        return false;
    if (!userObj.firstName || userObj.firstName == '')
        return false;
    if (!userObj.password || userObj.password == '')
        return false;
    
    
    return true;
}

module.exports = users;