
/*
 * Page to enter your address
 */

exports.address = function(req, res){
  //res.redirect(401, '/login');
  console.log("User: " + req.user);
  res.render('address', { title: 'Address Page'});
};