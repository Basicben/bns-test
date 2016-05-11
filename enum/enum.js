// Enums
var enums = {
    
    logs: {
        login: {
            'success': 'loginSuccess',
            'failed': 'loginFailed',
            'mongoError': 'loginMongoError',
        },
    },
    
    genderArrayMongo: ['male', 'female'],
    
    loginLogsArrayMongo: ['loginSuccess', 'loginFailed'],
    
    contactRelationsArrayMongo: ['father', 'mother', 'uncle', 'unt'],
    
    userRoles: {
        'admin': { name: 'admin', value : 60 },
        'manager': { name: 'manager', value : 40 },
        'guide': { name: 'guide', value : 30 },
        'client': { name: 'client', value : 20 },
        'public': { name: 'public', value : 10 }
    },
    
    userRolesArrayMongo : ['admin', 'manager', 'guide', 'client', 'public'],
    
    priority: {
        'highest': { name: 'highest', value : 50 },        
        'high': { name: 'high', value : 40 },
        'meduim': { name: 'meduim', value : 30 },
        'low': { name: 'low', value : 20 },
        'lowest': { name: 'lowest', value : 10 },
    },
    
    priorityTypesArrayMongo : ['highest', 'high', 'meduim', 'low', 'lowest'],
    
    missionPrivacy: {
        'private': { name: 'private', value : 20 },
        'public': { name: 'public', value : 10 },
    },
    
    missionPrivacyArrayMongo : ['global', 'private', 'social'],
    
    missionType: {
        'social': { name: 'social', value : 40 },
        'group': { name: 'group', value : 30 },
        'single': { name: 'single', value : 20 },
    },
    
    missionTypeArrayMongo : ['social', 'group', 'single'],
    
    notificationTypes: {
        'broadcastMessage': { name: 'broadcastMessage', value: 'Broadcase Message', modelUrl: 'models/notifications/broadcastMessageModel.js' },
        'mission': { name: 'mission', value: 'Mission', modelUrl: 'models/notifications/broadcastMessageModel.js' },
        'message': { name: 'message', value: 'Message', modelUrl: 'models/notifications/broadcastMessageModel.js' },
        'survey': { name: 'survey', value: 'Survey', modelUrl: 'models/survey/surveyModel.js' }
    },
    
    notificationTypesArrayMongo : ['broadcastMessage', 'mission', 'message', 'survey'],
    
    surveyTypes: {
        social: 'social',
    },
    
    surveyTypesArrayMongo: ['social'],
    
    errorTypes: {
        //1-99
        general: { code: 10, msg: null },
        mongoErr: { code: 25, msg: null },
        mongoObjNotExist: { code: 35, msg: 'Mongo Object does not exist' },
        noAuthorization: { code: 50, msg: 'No authorization to call this function' },
        // 100 - 199
        wrongDetails: { code: 100, msg: 'User has entered the wrong details' },
        wrongToken: { code: 125, msg: 'Token Not Found' },
        tokenExpired: { code: 126, msg: 'Token Expired' },
        partialInsert: { code: 150, msg: null },
        // 200 - 299
        login: {
            wrongPassword: { code: 200, msg: 'Wrong Input Password' },    
            wrongUsername: { code: 201, msg: 'Wrong Input Username or Id' },    
        },
        // 300 - 399
        socket: {
            noConnection: { code: 300, msg: 'No socket connection has been established' },    
            wrongDetails: { code: 350, msg: 'Wrong details delivered' },
        }
    },

};

module.exports = enums;
