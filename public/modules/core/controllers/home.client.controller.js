'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Urls', '$location', '$http', 'RequestObserver',
    function ($scope, Authentication, Urls, $location, $http, RequestObserver) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.saveButtonText = 'Save';
        localStorage.clear();

        $scope.nextStep = function(step) {
            $scope.step = ++step;
            $scope.doStep($scope.step);
        }

        $scope.doStep = function(step) {
            $scope.step = step;
            switch (step) {
                case 1: {
                    createUrl();
                    break
                }
                case 2: {
                    findOneUrl();
                    break
                }
                case 3: {
                    break
                }
                case 4: {
                    createResponse();
                    break
                }
            }
        }

        // Create new Url
        function createUrl() {
            // Create new Url object
            var url = new Urls({});

            // Redirect after save
            url.$save(function (response) {
                localStorage.id = response._id;
                $scope.nextStep($scope.step);

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find existing Url
        function findOneUrl() {
            Urls.get({
                urlId: localStorage.id
            }, function () {
                $scope.url = 'http://' + $location.$$host + ':' + $location.$$port + '/r/' + localStorage.id;
                waitForRequest();
            });
        };

        function waitForRequest() {
            var receivedStr = 'Received';
            RequestObserver.observe(localStorage.id, receivedStr);

            $scope.$on(receivedStr, function(event, args) {
                $scope.requestText = formatRequest(args);
                $scope.doStep(3);

                function formatRequest(req) {
                    var str = 'httpVersion:'+req.httpVersion+'\n';
                    str += 'method:'+req.method+'\n';
                    str += 'remoteAddress:'+req.remoteAddress+'\n';
                    str += 'url:'+req.url+'\n';
                    str += '\n';
                    str += 'headers:\n';
                    Object.keys(req.headers).forEach(function (key, index) {
                        str += '   '+key + ':' + this[key] + '\n';
                    }, req.headers);
                    return str;
                }
            });
        };

        function createResponse() {
            var id = localStorage.id;
            $http.post('/responses/' + id, {'body': $scope.responseText}).
                success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.saveButtonText = 'Update';
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(data);
                });
        };
    }
]);
