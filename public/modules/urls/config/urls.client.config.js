'use strict';

// Configuring the Articles module
angular.module('urls').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Urls', 'urls', 'dropdown', '/urls(/create)?');
        Menus.addSubMenuItem('topbar', 'urls', 'List Urls', 'urls');
        Menus.addSubMenuItem('topbar', 'urls', 'New Url', 'urls/create');
    }
]);
