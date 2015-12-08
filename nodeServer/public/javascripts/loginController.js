// LoginCtrl.js
angular.module('myApp').controller('LoginController', ['$scope', '$http', 'auth', 'store', '$location',
/**
 * This function controlls the login of the user.
 * @param {integer} auth The authorization code recieved from the API.
 * @param {string} store The name of the store from which to buy food.
 */
function ($scope, $http, auth, store, $location) {
  $scope.login = function () {
    auth.signin({}, function (profile, token) {
      // Success callback
      store.set('profile', profile);
      store.set('token', token);
      $location.path('../');
	  /** Error something went wrong. */
    }, function (err) {
      alert(err);
    });
  };
}]);