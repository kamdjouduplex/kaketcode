'use strict';

// Declare app level module which depends on views, and components
angular.module('dede', [
  'ngRoute',
  'dede.profile',
  'dede.post',
  'dede.home',
  'firebase',
  'flow',
  'naif.base64',
  'dede.service',
  'dede.settings',
  'monospaced.elastic',
  'ngAnimate',
  'dede.version'
])


/*.directive('ngElementReady', ['ngProgressLite', function(ngProgressLite) {
  
        return {
            priority: -1000, // a low number so this directive loads after all other directives have loaded. 
            restrict: "A", // attribute only
            link: function($scope, $element, $attributes) {
                console.log(" -- Element ready!");
                ngProgressLite.done();
                // do what you want here.
            }
        };
    }])*/
.constant('URL', "https://dede.firebaseio.com")

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/terms', {
      templateUrl: 'terms_conditions/terms.html',
      controller: 'TCCtrl'
    })
  .when('/conditions', {
      templateUrl: 'terms_conditions/conditions.html',
      controller: 'TCCtrl'
    })
  .otherwise({redirectTo: '/home'});
}])

.controller('TCCtrl', [function() {

}]);
