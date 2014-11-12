'use strict';

//Responses service used to communicate Responses REST endpoints
angular.module('core')
    .factory('RequestObserver', ['$rootScope', '$http', function ($rootScope, $http) {
        var notify = {};
        notify.observe = function (id, receivedStr) {
            $http.get('/requests/' + id).
                success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log(data);

                    $rootScope.$broadcast(receivedStr, data);
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
