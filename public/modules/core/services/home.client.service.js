'use strict';

//Responses service used to communicate Responses REST endpoints
angular.module('core')
    .factory('RequestObserver', ['$rootScope', '$http', function ($rootScope, $http) {
        var notify = {};
        notify.observe = function (id, receivedStr) {
            $http.get('/requests/' + id).
                success(function (data, status, headers, config) {
                    $rootScope.$broadcast(receivedStr, data);
                    // make request if another request comes in
                    notify.observe(id, receivedStr);
                });
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
