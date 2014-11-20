'use strict';

//Responses service used to communicate Responses REST endpoints
angular.module('core')
    .factory('RequestObserver', ['$rootScope', '$http', '$q', '$timeout', function ($rootScope, $http, $q, $timeout) {
        var notify = {};
        var deferred = $q.defer();
        notify.observe = function (id, receivedStr) {
            console.log(new Date());
            $http.get('/requests/' + id, { timeout: deferred.promise }).
                success(function (data, status, headers, config) {
                    $rootScope.$broadcast(receivedStr, data);
                    // make request if another request comes in
                    notify.observe(id, receivedStr);
                }).
                error(function(data, status, headers, config) {
                    console.log('error:'+data)
                });

            // if the requesting client makes a request in an hour,
            $timeout(function() {
                console.log(new Date());
                deferred.resolve();
            }, 60*60*1000);
        };

        return notify;
    }])
    .factory('Urls', ['$resource',
        function ($resource) {
            return $resource('urls/:urlId', {
                urlId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ]);
