'use strict';

// Configuring the Articles module
angular.module('responses').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Responses', 'responses', 'dropdown', '/responses(/create)?');
        Menus.addSubMenuItem('topbar', 'responses', 'List Responses', 'responses');
        Menus.addSubMenuItem('topbar', 'responses', 'New Response', 'responses/create');
    }
]);
