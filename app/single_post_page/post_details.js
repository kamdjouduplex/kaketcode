'use strict';

angular.module('dede.post', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/post/:id', {
    templateUrl: 'single_post_page/post_details.html',
    controller: 'PostCtrl'
  });
}])

.controller('PostCtrl', ['$scope', '$routeParams', 'post_service', function($scope, $routeParams, post_service) {
	var id = $routeParams.id;
	//$scope.posts = post_service.allObj;
	var obj = post_service.allPosts;	
	for (var i = 0; i < obj.length; i++) {
		if(obj[i].$id == id){
			$scope.post = obj[i];
		}
	};
	//$scope.posts = post_service.allObj["-JxuKThgIL08OLIq-eoK"];
	//console.log($scope.post);

}]);