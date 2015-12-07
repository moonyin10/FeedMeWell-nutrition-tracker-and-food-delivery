var lock = null;

$(document).ready(function() {
   lock = new Auth0Lock('pAvyFmdUXlNclg9xBE0w5x0LNVvu2ZjO', 'eatbit.auth0.com');
   var userProfile;
  $.ajaxSetup({
    'beforeSend': function(xhr) {
      if (localStorage.getItem('userToken')) {
        xhr.setRequestHeader('Authorization',
              'Bearer ' + localStorage.getItem('userToken'));
        alert('userToken');
      }
    }
  });
  $('.btn-login').click(function(e) {
    e.preventDefault();
    lock.show(function(err, profile, token) {
      if (err) {
        // Error callback
        alert('There was an error');
      } else {
        // Success callback
  
        // Save the JWT token.
        localStorage.setItem('userToken', token);
  
        // Save the profile
        userProfile = profile;
      }
    });
  });
});