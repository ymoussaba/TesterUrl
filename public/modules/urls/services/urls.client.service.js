'use strict';

//Urls service used to communicate Urls REST endpoints
angular.module('urls').factory('Urls', ['$resource',
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
