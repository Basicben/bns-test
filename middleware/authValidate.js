var getByRefreshToken = require('../modules/users/users.js').getByRefreshToken
var jwt = require('jwt-simple');
//var loggedInUser = {};

module.exports = function (req, res, next) {
    
    //next();
    //return;

    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe. 
    if (req.url.indexOf('/public/') == 0) {
        next();
        return;
    }
    
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    // decode token
    var decoded = jwt.decode(token, require('../config/secret.js')());

    // object validation
    if (!validateToken(decoded)) {
        res.status(400);
        res.json({
            "status": 40,
            "message": "Bad Token"
        });
        return;
    }
    // check token exparation
    if (decoded.exp <= Date.now()) {
        res.status(400);
        res.json({
            "status": 40,
            "message": "Token Expired"
        });
        return;
    }
    
    // check user role.
    // Authorize the user to see if s/he can access our resources logic.
    if (req.url.indexOf('/admin/') == 0 && GLOBAL.enums.userRoles[decoded.role].value != GLOBAL.enums.userRoles['admin'].value) {
        res.status(403);
        res.json({
            "status": 403,
            "message": "Not Authorized"
        });
        return;
    } else if (req.url.indexOf('/manager/') == 0 && GLOBAL.enums.userRoles[decoded.role].value != GLOBAL.enums.userRoles['manager'].value) {
        res.status(403);
        res.json({
            "status": 403,
            "message": "Not Authorized"
        });
        return;
    } else if (req.url.indexOf('/guide/') == 0 && GLOBAL.enums.userRoles[decoded.role].value != GLOBAL.enums.userRoles['guide'].value) {
        res.status(403);
        res.json({
            "status": 403,
            "message": "Not Authorized"
        });
        return;
    } else if (req.url.indexOf('/client/') == 0 && GLOBAL.enums.userRoles[decoded.role].value != GLOBAL.enums.userRoles['client'].value) {
        res.status(403);
        res.json({
            "status": 403,
            "message": "Not Authorized"
        });
        return;
    }
    
    req.user = decoded;
    console.log('req.user',req.user);
    // check if refresh token is correct
    //getByRefreshToken(decoded.token, function (result) {
    //    if (result.err) {
    //        res.status(403);
    //        res.json({
    //            "status": 403,
    //            "message": "user - Not Authorized"
    //        });
    //        return;
    //    }
    //    
    //    if (!result) {
    //        res.json({
    //            "status": 403,
    //            "message": "user - Not Authorized"
    //        });
    //        return;
    //    }
    //    
    //    next();
    //});
    
    
    next();
    
};


var validateToken = function (tokenObj) {
    if (!tokenObj.email)
        return false;
    if (!(tokenObj.role && GLOBAL.enums.userRoles[tokenObj.role] != undefined))
        return false;

    return true;
}