//'use strict';
//
////Responses service used to communicate Responses REST endpoints
//angular.module('home')
//    .factory('RequestObserver', ['$rootScope', '$http', function ($rootScope, $http) {
//        var notify = {};
//        notify.observe = function (id, receivedStr) {
//            $http.post('/responses/' + id).
//                success(function (data, status, headers, config) {
//                    // this callback will be called asynchronously
//                    // when the response is available
//                    console.log(data);
//                    $http.get('/requests/' + data._id).
//                        success(function (data, status, headers, config) {
//                            // this callback will be called asynchronously
//                            // when the response is available
//                            console.log(data);
//
//                            $rootScope.$broadcast(receivedStr);
//                        });
//
//
//                }).
//                error(function (data, status, headers, config) {
//                    // called asynchronously if an error occurs
//                    // or server returns response with an error status.
//                    console.log(data);
//                });
//        };
//
//        return notify;
//    }]);
