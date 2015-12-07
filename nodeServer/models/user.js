var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

// yay!
var userSchema = mongoose.Schema({
    name: {type: String},
    password: {type: String},
    google: {
        id: {type: String},
        token: {type: String},
        name: {type: String},
        email: {type: String}
    },
    facebook: {
        id: {type: String},
        token: {type: String},
        name: {type: String},
        email: {type: String}
    },
    foodPreference: {type: Array, default: []},
    tokens: {
        fitbit: {
            access: {type: String, default: ""},
            refresh: {type: String, default: ""}
        },
        delivery: {
            access: {type: String, default: ""},
            refresh: {type: String, default: ""}
        },
    },
    address: {type: String, default: "1178, Broadway 10001 New York"},
    cart: {type: Array, default: []}
});

userSchema.plugin(findOrCreate);

userSchema.methods.speak = function () {
var greeting = this.name
  ? "[SUCCESS] User " + this.name + " was created"
  : "[WARNING] Nameless user created";
console.log(greeting);
};

var User = mongoose.model('User', userSchema);

module.exports = {
   User: User 
};