'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', 'ngClipProvider',
    function ($stateProvider, $urlRouterProvider, ngClipProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
            state('home', {
                url: '/',
                templateUrl: 'modules/core/views/home.client.view.html'
            });

        ngClipProvider.setPath('/lib/zeroclipboard/dist/ZeroClipboard.swf');
    }
]);
