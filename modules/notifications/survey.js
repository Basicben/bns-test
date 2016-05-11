var surveyModel = require('../../models/survey/surveyModel.js');
var groupModel = require('../../models/groups/groupModel.js');

var Group = require('../groups/group.js');

var errorEnum = GLOBAL.enums.errorTypes;
var error = require('../errors.js');

var survey = {
    add: function (newSurvey, cb) {
        var survey = surveyModel(newSurvey);
        
        // save model.
        survey.save(function (err, surveyObj) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            // survey has been saved.
            console.log('Survey has been saved', surveyObj.title)
            cb({ result: surveyObj });
        });
    },
    get: function (surveyId, cb) {
        
        surveyModel.findOne({ '_id': surveyId }, function (err, docs) {
            
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            if (!docs) {
                cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
                return;
            }
            
            cb({ result : docs });
        });
    },
    getCreatedSurveys: function (userId, cb) {
        
        surveyModel.findOne({ 'createdBy': userId }, function (err, docs) {
            
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            if (!docs) {
                cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
                return;
            }
            
            cb({ result : docs });
        });
    },
    vote: function (surveyId, optionId, userId, cb) {
        
        var voter = { user: userId, option: optionId };
        surveyModel.update({ '_id': surveyId, 'options._id': optionId }, { $push: { votes: voter } }, function (err, docs) {
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            
            if (!docs) {
                cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
                return;
            }
            
            cb({ result: docs });
        });
    }
};

module.exports = survey;

