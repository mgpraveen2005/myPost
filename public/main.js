/*
Author: Praveen
Created: 2015-06-29
*/

var mainApp = angular.module("mainApp", ['ngRoute']);
 
mainApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'html/list.html',
            controller: 'listPostController'
        })
        .when('/view/:title', {
            templateUrl: 'html/details.html',
            controller: 'detailPostController'
        })
		.when('/add', {
            templateUrl: 'html/add.html',
            controller: 'addPostController'
        })
		.when('/listByAuthor', {
            templateUrl: 'html/listByAuthor.html',
            controller: 'listByAuthorController'
        })
		.when('/mostVisits', {
            templateUrl: 'html/mostVisits.html',
            controller: 'mostVisitsController'
        })
        .otherwise({
            redirectTo: '/'
        });
});
 
mainApp.controller('listPostController', function($scope, $http) {
	// List all posts
    $http.get('/api/list').
	  success(function(data, status, headers, config) {
		$scope.posts = [];
		data.results[0].data.forEach(function(entry) {
			entry.row[0].timestamp = dateFormat(entry.row[0].timestamp);
			$scope.posts.push(entry.row[0]);
		});
	  }).
	  error(function(data, status, headers, config) {
		
	  });
})
.controller('detailPostController', function($scope, $routeParams, $http) {
	// Fetch the Details of a Post
    $http.get('/api/detail/'+$routeParams.title).
	  success(function(data, status, headers, config) {
		$scope.post = data.results[0].data[0].row[0];
		$scope.post.timestamp = dateFormat($scope.post.timestamp);
	  }).
	  error(function(data, status, headers, config) {
		
	  });
})
.controller('addPostController', function($scope, $http, $window) {
	// Add new Post
	$scope.newpost = {};
	$scope.submit = function() {
		console.log($scope.newpost);
		$http.post('/api/add', $scope.newpost)
		.success(function(data, status, headers, config) {
			$window.location.href = '/#/';
		})
		.error(function(data, status, headers, config) {
			
		});
	};
})
.controller('mostVisitsController', function($scope, $http) {
	// List all posts by Visits
	$http.get('/api/mostVisits').
	  success(function(data, status, headers, config) {
		$scope.posts = [];
		data.results[0].data.forEach(function(entry) {
			entry.row[0].timestamp = dateFormat(entry.row[0].timestamp);
			$scope.posts.push(entry.row[0]);
		});
	  }).
	  error(function(data, status, headers, config) {
		
	  });
})
.controller('listByAuthorController', function($scope, $http) {
	// List all Authors
	$http.get('/api/authorList').
	  success(function(data, status, headers, config) {
		$scope.authors = [];
		data.results[0].data.forEach(function(entry) {
			$scope.authors.push(entry.row[0]);
		});
	  }).
	  error(function(data, status, headers, config) {
		
	  });
	 $scope.getPostsByAuthor = function() {
		 // List all posts by an Author
		 $http.get('/api/listByAuthor/'+$scope.author).
		  success(function(data, status, headers, config) {
			$scope.posts = [];
			data.results[0].data.forEach(function(entry) {
				entry.row[0].timestamp = dateFormat(entry.row[0].timestamp);
				$scope.posts.push(entry.row[0]);
			});
		  }).
		  error(function(data, status, headers, config) {
			
		  });
	 }
});

var dateFormat = function(timestamp) {
	// Format Date
	var date = new Date(timestamp);
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + '  ' + date.getHours() + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}