
/*
 * GET home page.
 */

exports.log = function(req, res){
  //console.log(JSON.stringify(res));
  res.render('login', { title: 'Login Page' });
};