'use strict';

//Setting up route
angular.module('responses').config(['$stateProvider',
    function ($stateProvider) {
        // Responses state routing
        $stateProvider.
            state('listResponses', {
                url: '/responses',
                templateUrl: 'modules/responses/views/list-responses.client.view.html'
            }).
            state('createResponse', {
                url: '/responses/create/:responseId',
                templateUrl: 'modules/responses/views/create-response.client.view.html'
            }).
            state('viewResponse', {
                url: '/responses/:responseId',
                templateUrl: 'modules/responses/views/view-response.client.view.html'
            }).
            state('editResponse', {
                url: '/responses/:responseId/edit',
                templateUrl: 'modules/responses/views/edit-response.client.view.html'
            });
    }
]);
