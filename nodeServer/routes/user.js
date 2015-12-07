
/*
 * GET users listing.
 */
var userServices = require('../services/user');
var user = {name: "Otto", password: "Motto"};
exports.list = function(req, res, next){
    userServices.addUser(user, function(err){
        if (err) {
            res.send("Error...");
        }
        else {
            res.send("User " + user.name + " was added to the database! hAHAHAHAHAHAHAHHAHAHA");
        }
    });
};