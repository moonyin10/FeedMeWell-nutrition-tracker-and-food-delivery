/** Sets the state of the lock. Initially at null. */
var lock = null;

/**
 * Determines if the application is ready to go.
 * The state of the lock is checked and a new authorization is issued when through the option at eatbit.auth0.com.
 * A request is made and the system waits for an alert repsonse with the relevant user token.
 * Once the relevant information is received it's stored in the local storage.
 */
$(document).ready(function() {
   lock = new Auth0Lock('pAvyFmdUXlNclg9xBE0w5x0LNVvu2ZjO', 'eatbit.auth0.com');
   /** Variables regarding the user data saved on the server. */
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