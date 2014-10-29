'use strict';

// Responses controller
angular.module('responses').controller('ResponsesController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Responses', 'blockUI', 'Notify', 'Urls',
	function($scope, $stateParams, $http, $location, Authentication, Responses, blockUI, Notify, Urls) {
		$scope.authentication = Authentication;

		// Create new Response
		$scope.create = function() {

			var id = $location.$$url.split('/')[3];
			$http.post('/responses/'+id, {'body':$scope.responseText}).
				success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					console.log(data);
				}).
				error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					console.log(data);
				});





			//var myTextArea = angular.element.find("#myTextArea");
			//var response = new Responses ({
			//	responseText: $scope.responseText
			//});
			//response.$save(function(result) {
			//	console.log('ss');
			//});

			//// Create new Response object
			//var response = new Responses ({
			//	name: this.name
			//});
            //
			//// Redirect after save
			//response.$save(function(response) {
			//	$location.path('responses/' + response._id);
            //
			//	// Clear form fields
			//	$scope.name = '';
			//}, function(errorResponse) {
			//	$scope.error = errorResponse.data.message;
			//});
		};

		// Remove existing Response
		$scope.remove = function( response ) {
			if ( response ) { response.$remove();

				for (var i in $scope.responses ) {
					if ($scope.responses [i] === response ) {
						$scope.responses.splice(i, 1);
					}
				}
			} else {
				$scope.response.$remove(function() {
					$location.path('responses');
				});
			}
		};

		// Update existing Response
		$scope.update = function() {
			var response = $scope.response ;

			response.$update(function() {
				$location.path('responses/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Responses
		$scope.find = function() {
			$scope.responses = Responses.query();
    };

        $scope.ready = function() {
            blockUI.start('Make a request already :)');
			var id = $location.$$url.split('/')[3];
            Notify.sendMsg('Waiting', {'id':id});

			$scope.$on('Received', function() {
				blockUI.stop();
			});
        };


        // Find existing Response
		$scope.findOne = function() {
			$scope.response = Responses.get({ 
				responseId: $stateParams.responseId
			});
		};
	}
]);
