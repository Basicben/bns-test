// the main route navigation.
var express = require('express');
var router = express.Router();

var user = require('./users.js');
var organization = require('./organization.js');
var hostel = require('./hostel.js');
var mission = require('./mission.js');
var message = require('./message.js');
var survey = require('./survey.js');
var group = require('./group.js');
var login = require('./login.js');
var notification = require('./notifications.js');
var timetable = require('./timetable.js');
var enums = require('./enums.js');
var category = require('./category.js');


/*
 * Routes that can be accessed by any one - public 
 */

router.post('/public/login', login.login);
router.post('/public/login/validate', login.validate);
router.post('/public/login/forgotPassword', login.forgotPassword);
router.post('/public/login/validateForgotPasswordToken', login.validateForgotPasswordToken);
router.post('/public/login/changePassword', login.changePassword);

/*
 * Routes that can be accessed only by authenticated & authorized users
 * the logic of who is authorized &/|| authenticated users are in middleware/authValidate.js
 */

// admin routes //
router.post('/admin/user/get', user.get);
router.post('/admin/user/addAdmin', user.addAdmin);
router.post('/admin/organization/add', organization.add);
router.post('/admin/organization/getWithHierarchy', organization.getWithHierarchy);
router.post('/admin/hostel/add', hostel.add);
router.post('/admin/category/addBulk', category.addBulk);
router.post('/admin/category/getAll', category.getAll);

// manager routes
router.post('/manager/user/get', user.get);
router.post('/manager/user/addManager', user.addManager);
router.post('/manager/user/addGuide', user.addGuide);
router.post('/manager/category/getAll', category.getAll);

//guide routs
//router.post('/guide/user/getMyClients', user.getMyClients);
router.post('/guide/user/getAllGuides', user.getAllGuides);
router.post('/guide/user/getAllClients', user.getAllClients);
router.post('/guide/user/get', user.get);
router.post('/guide/user/getUser', user.get);
router.post('/guide/user/delete', user.delete);
router.post('/guide/user/deleteUser', user.deleteUser);
router.post('/guide/user/getUsersBeneath', user.getUsersBeneath);
router.post('/guide/user/addClient', user.addClient);
router.post('/guide/user/addGuide', user.addGuide);
router.post('/guide/user/update', user.update);
router.post('/guide/user/updateUser', user.update);
router.post('/guide/organization/get', organization.get);
router.post('/guide/hostel/get', hostel.get);
router.post('/guide/apartment/add', hostel.addApartment);
router.post('/guide/apartment/getAll', hostel.getAllApartments);
router.post('/guide/apartment/getOne', hostel.getOneApartment);
router.post('/guide/broadcast/message', message.broadcastMessage);
router.post('/guide/broadcast/survey', survey.add);
router.post('/guide/groups/getGroupsBySurvey', group.getGroupsBySurvey);
router.post('/guide/survey/get', survey.get);
router.post('/guide/timetable/addSingleActivity', timetable.addSingleActivity);
router.post('/guide/timetable/addMyActivity', timetable.addMyActivity);
router.post('/guide/mission/add', mission.add);
router.post('/guide/mission/get', mission.get);
router.post('/guide/notifications/get', notification.get);
router.post('/guide/notifications/getSpecific', notification.getSpecific);
router.post('/guide/getDashboardEnums', enums.getDashboardEnums);
router.post('/guide/getUserRoleTypes', enums.getUserRoleTypes);
router.post('/guide/getGenderTypes', enums.getGenderTypes);
router.post('/guide/getMissionPrivacies', enums.getMissionPrivacies);
router.post('/guide/category/getAll', category.getAll);

/****************************************/
// TO DELETE
router.post('/guide/category/addBulk', category.addBulk);
router.post('/admin/mission/add', mission.add);
/****************************************/


// client routes
router.post('/client/timetable/addMyActivity', timetable.addMyActivity);
router.post('/client/timetable/get', timetable.get);
router.post('/client/organization/get', organization.get);
router.post('/client/user/get', user.get);
router.post('/client/user/update', user.update);
router.post('/client/hostel/get', hostel.get);
router.post('/client/groups/getGroups', group.getGroups);
router.post('/client/groups/getGroupsBySurvey', group.getGroupsBySurvey);
router.post('/client/survey/vote', survey.vote);
router.post('/client/apartment/get', hostel.getMyApartment);
router.post('/client/survey/get', survey.get);
router.post('/client/notifications/get', notification.get);
router.post('/client/notifications/getSpecific', notification.getSpecific);
// delete this and the rest of the route
router.post('/client/test/get', hostel.getClientIds);

//router.post('/client/notifications/getByType', notification.getByType);

module.exports = router;