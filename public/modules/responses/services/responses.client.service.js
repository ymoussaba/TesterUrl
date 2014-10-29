'use strict';

//Responses service used to communicate Responses REST endpoints
angular.module('responses')
    .factory('Responses', ['$resource', function ($resource) {
        return $resource('responses/:responseId', {
            responseId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }])
    .factory('Notify', ['$rootScope', '$http', function ($rootScope, $http) {
        var notify = {};
        notify.sendMsg = function (msg, data) {
//            data = data || {};
//            $rootScope.$emit(msg,data);
//            console.log(msg);
            if (msg === 'Waiting') {
                $http.post('/responses/' + data.id).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log(data);

                        $http.get('/requests/' + data._id).
                            success(function (data, status, headers, config) {
                                // this callback will be called asynchronously
                                // when the response is available
                                console.log(data);

                                $rootScope.$broadcast('Received');
                            });


                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log(data);
                    });


                //$http.get('/requests/'+data.id).
                //    success(function(data, status, headers, config) {
                //        // this callback will be called asynchronously
                //        // when the response is available
                //        console.log(data);
                //    }).
                //    error(function(data, status, headers, config) {
                //        // called asynchronously if an error occurs
                //        // or server returns response with an error status.
                //        console.log(data);
                //    });
            }
        };

//        notify.getMsg = function(msg, func, $scope) {
//            var unbind = $rootScope.$on(msg, func);
//
//            if (scope) {
//                scope.$on('destroy', unbind);
//            }
//        }

        return notify;
    }]);
