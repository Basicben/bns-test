var Login = require('../modules/login.js');
//var aes = require('../middleware/hash/aes.js');
var requestIp = require('request-ip');

var login = {
    getIp: function (req) {
        return requestIp.getClientIp(req);
    },
    login: function (req, res) {
        var data = req.body.data || '';
        
        if (!validateLogin(data)) {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
        Login.login(data.username, data.password, data.isRemember, login.getIp(req), data.isAdmin, function (result) {
            res.json(result);
        });
    },
    validate: function (req, res) {
        var token = req.body.token || '';
        
        if (token == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
        Login.validate(token, function (result) {
            res.json(result);
        });
    },
    forgotPassword: function (req, res) {
        
        var username = req.body.username || '';
        
        if (username == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
        
        Login.forgotPassword(username, function (result) {
            res.json(result);
        });

        // send mail with uniq temporery token.
    },
    validateForgotPasswordToken: function (req, res) {
        var token = req.body.token || '';
        
        if (token == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
        
        Login.validateForgotPasswordToken(token, function (result) {
            res.json(result);
        });
        
    },
    changePassword: function (req, res) {
        
        var passwordUniqToken = req.body.token || '';
        var password = req.body.password || '';
        
        if (passwordUniqToken == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
        
        Login.changePassword(passwordUniqToken, password, function (result) {
            res.json(result);
        });
    },
}

// validate if all login fileds are available
var validateLogin = function (loginObj) {
    
    if (!loginObj)
        return false;
    if (!loginObj.id && !loginObj.username)
        return false;
    if (!loginObj.password)
        return false;
    
    return true;
}


module.exports = login;
