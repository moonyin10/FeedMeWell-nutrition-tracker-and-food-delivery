
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , login = require('./routes/login')
  , http = require('http')
  , path = require('path')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , User = require('./models/user').User
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  ;/*
  , passport = require('passport')
  , passportLocal = require('passport-local')
  , expressSession = require('express-session');
*/
var app = express();

// mongodb
mongoose.connect('mongodb://localhost:27017/');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// required for passport session
app.use(session({
  secret: 'secrettexthere',
  saveUninitialized: true,
  resave: true
}));

passport.serializeUser(function(user, done) {
  console.log("[STATUS] Serializing");
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("[STATUS] Deserializing");
  User.findById(id, function(err, user) {
      
      done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: "116144058942-ubeacp482db65a857umqoae9ar2lufs3.apps.googleusercontent.com",
    clientSecret: "_wQshZFtMvRLjFnAjAVfOwbR",
    callbackURL: "https://nodeauthentication-kino6052.c9.io/auth/google/callback"
  },
  function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    console.log("[STATUS] User is Found (Line 63)");
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    //newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

passport.use(new FacebookStrategy({
    clientID: "207981646200067",
    clientSecret: "db1f9259916e16e94be9e2c6a02fa6de",
    callbackURL: "https://nodeauthentication-kino6052.c9.io/auth/facebook/callback"
  },
  function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    console.log("[STATUS] User is Found (Line 63)");
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();
                    console.log(profile);
                    // set all of the relevant information
                    newUser.facebook.id    = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name  = profile.displayName;
                    //newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
//app.use(session({ secret: 'anything' }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/login', jwtCheck);
app.use(passport.initialize());
// persistent login sessions 
app.use(passport.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', isLoggedIn, function(req, res){
  console.log(req.isAuthenticated());
  routes.index(req, res);
});

app.get('/login', login.log);
app.post('/login', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/auth/google',
  passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { 
      failureRedirect: '/login',
      successRedirect: '/'
  }));
  
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));
  
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});


function isLoggedIn(req, res, next) {
  console.log("isAuthenticated? " + req.isAuthenticated());
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}
