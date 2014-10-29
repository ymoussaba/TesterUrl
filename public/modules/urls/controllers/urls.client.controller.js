'use strict';

// Urls controller
angular.module('urls').controller('UrlsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Urls',
    function ($scope, $stateParams, $location, Authentication, Urls) {
        $scope.authentication = Authentication;

        // Create new Url
        $scope.create = function () {
            // Create new Url object
            var url = new Urls({
                name: this.name
            });

            // Redirect after save
            url.$save(function (response) {
                $location.path('urls/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find existing Url
        $scope.findOne = function () {
            Urls.myId = $stateParams.urlId;
            $scope.id = $stateParams.urlId;
            $scope.url = Urls.get({
                urlId: $stateParams.urlId
            }, function () {
                $scope.url.value = 'http://' + $location.$$host + ':' + $location.$$port + '/r/' + $stateParams.urlId;
            });
        };
    }
]);
