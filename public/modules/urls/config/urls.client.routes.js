'use strict';

//Setting up route
angular.module('urls').config(['$stateProvider',
    function ($stateProvider) {
        // Urls state routing
        $stateProvider.
            state('listUrls', {
                url: '/urls',
                templateUrl: 'modules/urls/views/list-urls.client.view.html'
            }).
            state('createUrl', {
                url: '/urls/create',
                templateUrl: 'modules/urls/views/create-url.client.view.html'
            }).
            state('viewUrl', {
                url: '/urls/:urlId',
                templateUrl: 'modules/urls/views/view-url.client.view.html'
            }).
            state('editUrl', {
                url: '/urls/:urlId/edit',
                templateUrl: 'modules/urls/views/edit-url.client.view.html'
            });
    }
]);
