var Category = require('../modules/category/category.js');

var category = {
    addBulk: function (req, res) {
        var categories = req.body.categories || '';
        // validation       
        if (categories == '') {
            res.status(401);
            res.json({
                err: {
                    "status": 401,
                    "message": "Invalid data for add hostel function"
                }
            });
            return;
        }
        Category.addBulk(categories, function (result) {
            res.json(result);
        });
    },
    getAll: function (req, res) {
        Category.getAll(function (result) {
            res.json(result);
        });
    }
};

module.exports = category;