
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
module.exports = function(){
  passport.use(new GoogleStrategy({
      clientID: "1072962958628-br699p37ssthmfj4ub53ajurfg7d6rl6.apps.googleusercontent.com",
      clientSecret: "LO4LFMOAtTy8vSfOcbhI62KC",
      callbackURL: "https://nodeauthentication-kino6052.c9.io/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log("test");
    }
  ));
};