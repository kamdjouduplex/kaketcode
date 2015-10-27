'use strict';

angular.module('dede.settings', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/settings', {
    templateUrl: 'setting_page/settings.html',
    controller: 'SettingsCtrl'
  });
}])

.controller('SettingsCtrl', [function() {

}]);