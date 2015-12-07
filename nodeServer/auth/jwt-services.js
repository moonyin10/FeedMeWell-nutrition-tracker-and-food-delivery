var jwt = require('express-jwt');

exports.jwt = jwt({
  secret: new Buffer('4SGpCdncLWKWCEMz6tBeXf2mDpHzM3zte_K_ki19hsfjn8Ju8dKf59Iu22TQ3f4c', 'base64'),
  audience: 'pAvyFmdUXlNclg9xBE0w5x0LNVvu2ZjO'
});

exports.redirect = function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.redirect('/login');
    console.log(err);
  }
  else {
    next();
  }
};