var User = require('../models/user').User;

exports.addUser = function(user, next) {
    var newUser = new User({
        name: user.name,
        password: user.password
    });
    newUser.save(function(err){
        if (err) {
            return next(err);
        }
        return next(null);
    });
};

exports.findUser = function(user, next) {
    User.findOne({name: user}, function(err, user){
       if (err){
           next(err);
       } 
       else next(user);
    });
};

