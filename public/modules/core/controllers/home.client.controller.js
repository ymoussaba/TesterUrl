'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Urls', '$location', '$http', 'RequestObserver', 'AnchorSmoothScroll', 'toaster', '$window',
    function ($scope, Authentication, Urls, $location, $http, RequestObserver, AnchorSmoothScroll, toaster, $window) {
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
                    gotoElement('step3');
                    $window.ga('send', 'pageview', { page: 'step3'});
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
            $window.ga('send', 'pageview', { page: 'step1'});
        };

        // Find existing Url
        function findOneUrl() {
            gotoElement('step2');
            Urls.get({
                urlId: localStorage.id
            }, function () {
                $scope.url = 'http://' + $location.$$host + ':' + $location.$$port + '/r/' + localStorage.id;
                waitForRequest();
            });
            $window.ga('send', 'pageview', { page: 'step2'});
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
                    toaster.pop('success', 'Response updated.', 'Check your requesting client for this response.');
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(data);
                    toaster.pop('warning', 'Whoops! Something bad happened.');
                });

            $window.ga('send', 'pageview', { page: 'step4'});
        };

        function gotoElement(eID){
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(eID);

            // call $anchorScroll()
            AnchorSmoothScroll.scrollTo(eID);

        };
    }
]);
