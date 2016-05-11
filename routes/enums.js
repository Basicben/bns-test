// import enums  hhh

var enums = {
    getDashboardEnums: function (req, res) {
        var enums = {
            userRoles: GLOBAL.enums.userRolesArrayMongo,
            missionPrivacy: GLOBAL.enums.missionPrivacyArrayMongo,
            surveyTypes: GLOBAL.enums.surveyTypesArrayMongo,
            gender: GLOBAL.enums.genderArrayMongo,
            contactTypes: GLOBAL.enums.contactRelationsArrayMongo,
        };
        cb({ result : enums });
    },
    getUserRoleTypes: function (req, res) {
        cb({ result : GLOBAL.enums.userRolesArrayMongo });
    },
    getGenderTypes: function (req, res) {
        cb({ result : GLOBAL.enums.genderArrayMongo });
    },
    getMissionPrivacies: function (req, res) {
        cb({ result : GLOBAL.enums.missionPrivacyArrayMongo });
    }
};



module.exports = enums;