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
            // send survey notification to relevant users.
            if (newSurvey.type == GLOBAL.enums.surveyTypes.social) {
                var groupsArr = []
                // create new common interest groups as the number of options
                surveyObj.options.forEach(function (option) {
                    // create common interest group object.
                    groupsArr.push({
                        name: option.name,
                        img: option.img,
                        content: option.content,
                        // allow guide to use the group by adding to group.users
                        users: [surveyObj.createdBy],
                        optionId: option._id,
                        survey: surveyObj._id,
                        createdBy: surveyObj.createdBy,
                        expirationDate: surveyObj.expirationDate,
                    });
                });
                
                // add group to system.
                Group.add(groupsArr, function (res) {
                           
                });
                
                cb({ result: surveyObj });
            }
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
            
            groupModel.find({ 'survey': surveyId }, function (err, groups) {
                
                if (err) {
                    cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                    return;
                }
                
                if (!groups) {
                    cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
                    return;
                }
                
                cb({ survey : docs, groups: groups });

            });

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
            
            groupModel.find({ 'survey': surveyId }, function (err, groups) {
                
                if (err) {
                    cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                    return;
                }
                
                if (!groups) {
                    cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
                    return;
                }
                
                cb({ survey : docs, groups: groups });

            });

        });
    },
    vote: function (surveyId, optionId, userId, cb) {
        
        var voter = { user: userId, option: optionId };
        
        //surveyModel.update({ '_id': surveyId, 'options._id': optionId }, { $push: { votes: voter } }, function (err, obj) {
        //    if (err) {
        //        cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
        //        return;
        //    }
        //    
        //    if (!obj) {
        //        cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
        //        return;
        //    }
        //    
        //    cb({ result: obj });
        //});
        
        surveyModel.findOne({ '_id': surveyId, 'options._id': optionId }, function (err, docs) {
            // error validation
            if (err) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            // object validation
            if (!docs) {
                cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                return;
            }
            // push voter into votes array in db
            docs.votes.push(voter);
            docs.save();
            
            // check what of of survey is this
            // and act accordingly
            if (docs.type == GLOBAL.enums.surveyTypes.social) {
                // if type is social,
                // find the right group
                // and add the one who voted, to it.
                groupModel.find({ 'option': optionId }, function (err, group) {
                    
                    if (err) {
                        cb({ err: { code: errorEnum.mongoErr.code , msg: err } });
                        return;
                    }
                    
                    if (!group) {
                        cb({ err: { code: errorEnum.mongoObjNotExist.code , msg: errorEnum.mongoObjNotExist.msg } });
                        return;
                    }
                    
                    // add user to group
                    group.users.push(userId);
                    group.save();
                    // return group object.
                    cb({ result : group });
            
                });
            }
        });
    }
};

module.exports = survey;