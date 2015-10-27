'use strict';

angular.module('dede.profile', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile/user/:username', {
    templateUrl: 'profile_page/profile.html',
    controller: 'ProfileCtrl'
  });
}])

.controller('ProfileCtrl', [function() {

}]);