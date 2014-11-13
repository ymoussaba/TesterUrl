'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'testkit';
    var applicationModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils', 'toaster'];

    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
    function ($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
            state('home', {
                url: '/',
                templateUrl: 'modules/core/views/home.client.view.html'
            }).
            state('baseHome', {
            url: '',
            templateUrl: 'modules/core/views/home.client.view.html'
        });
    }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
    function ($scope, Authentication, Menus) {
        $scope.authentication = Authentication;
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');

        $scope.toggleCollapsibleMenu = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function () {
            $scope.isCollapsed = false;
        });
    }
]);

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Urls', '$location', '$http', 'RequestObserver', 'AnchorSmoothScroll', 'toaster', '$window',
    function ($scope, Authentication, Urls, $location, $http, RequestObserver, AnchorSmoothScroll, toaster, $window) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.nextStep = function(step) {
            $scope.step = ++step;
            $scope.doStep($scope.step);
        };

        $scope.doStep = function(step) {

            $scope.step = step;
            switch (step) {
                case 0: {
                    init();
                    break;
                }
                case 1: {
                    createUrl();
                    break;
                }
                case 2: {
                    findOneUrl();
                    break;
                }
                case 3: {
                    gotoElement('step3');
                    $window.ga('send', 'pageview', { page: 'step3'});
                    break;
                }
                case 4: {
                    createResponse();
                    break;
            }
            }
        };

        function init() {
            //gotoElement('step0');
            $scope.saveButtonText = 'Save';
            localStorage.clear();
        }

        // Create new Url
        function createUrl() {
            // Create new Url object
            var url = new Urls({});
            // Redirect after save
            url.$save(function (response) {
                localStorage.id = response._id;
                $scope.nextStep($scope.step);

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
            $window.ga('send', 'pageview', { page: 'step1'});
        }

        // Find existing Url
        function findOneUrl() {
            gotoElement('step2');
            Urls.get({
                urlId: localStorage.id
            }, function () {
                $scope.url = 'http://' + $location.$$host + ':' + $location.$$port + '/r/' + localStorage.id;
                waitForRequest();
            });
            $window.ga('send', 'pageview', { page: 'step2'});
        }

        function waitForRequest() {
            var receivedStr = 'Received';
            RequestObserver.observe(localStorage.id, receivedStr);

            $scope.$on(receivedStr, function(event, args) {

                function formatRequest(req) {
                    var str = 'httpVersion:'+req.httpVersion+'\n';
                    str += 'method:'+req.method+'\n';
                    str += 'remoteAddress:'+req.remoteAddress+'\n';
                    str += 'url:'+req.url+'\n';
                    str += '\n';
                    str += 'headers:\n';
                    Object.keys(req.headers).forEach(function (key, index) {
                        str += '   '+key + ':' + this[key] + '\n';
                    }, req.headers);
                    str += '\n';
                    str += 'body:\n';
                    Object.keys(req.body).forEach(function (key, index) {
                        str += '   '+key + ':' + this[key] + '\n';
                    }, req.body);
                    return str;
                }
                $scope.requestText = formatRequest(args);
                $scope.doStep(3);
            });
        }

        function createResponse() {
            var id = localStorage.id;
            $http.post('/responses/' + id, {'body': $scope.responseText}).
                success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.saveButtonText = 'Update';
                    toaster.pop('success', 'Response updated.', 'Check your requesting client for this response.');
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(data);
                    toaster.pop('warning', 'Whoops! Something bad happened.');
                });

            $window.ga('send', 'pageview', { page: 'step4'});
        }

        function gotoElement(eID){
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(eID);

            // call $anchorScroll()
            AnchorSmoothScroll.scrollTo(eID);

        }
    }
]);

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

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

    function () {
        // Define a set of default roles
        this.defaultRoles = ['*'];

        // Define the menus object
        this.menus = {};

        // A private function for rendering decision
        var shouldRender = function (user) {
            if (user) {
                if (!!~this.roles.indexOf('*')) {
                    return true;
                } else {
                    for (var userRoleIndex in user.roles) {
                        for (var roleIndex in this.roles) {
                            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                                return true;
                            }
                        }
                    }
                }
            } else {
                return this.isPublic;
            }

            return false;
        };

        // Validate menu existance
        this.validateMenuExistance = function (menuId) {
            if (menuId && menuId.length) {
                if (this.menus[menuId]) {
                    return true;
                } else {
                    throw new Error('Menu does not exists');
                }
            } else {
                throw new Error('MenuId was not provided');
            }

            return false;
        };

        // Get the menu object by menu id
        this.getMenu = function (menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            return this.menus[menuId];
        };

        // Add new menu object by menu id
        this.addMenu = function (menuId, isPublic, roles) {
            // Create the new menu
            this.menus[menuId] = {
                isPublic: isPublic || false,
                roles: roles || this.defaultRoles,
                items: [],
                shouldRender: shouldRender
            };

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenu = function (menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            delete this.menus[menuId];
        };

        // Add menu item object
        this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Push new menu item
            this.menus[menuId].items.push({
                title: menuItemTitle,
                link: menuItemURL,
                menuItemType: menuItemType || 'item',
                menuItemClass: menuItemType,
                uiRoute: menuItemUIRoute || ('/' + menuItemURL),
                isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
                roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
                position: position || 0,
                items: [],
                shouldRender: shouldRender
            });

            // Return the menu object
            return this.menus[menuId];
        };

        // Add submenu item object
        this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
                    // Push new submenu item
                    this.menus[menuId].items[itemIndex].items.push({
                        title: menuItemTitle,
                        link: menuItemURL,
                        uiRoute: menuItemUIRoute || ('/' + menuItemURL),
                        isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
                        roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
                        position: position || 0,
                        shouldRender: shouldRender
                    });
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenuItem = function (menuId, menuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
                    this.menus[menuId].items.splice(itemIndex, 1);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeSubMenuItem = function (menuId, submenuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
                    if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
                        this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
                    }
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        //Adding the topbar menu
        this.addMenu('topbar');
    }
]);

'use strict';

// grabbed from http://jsfiddle.net/brettdewoody/y65G5/
angular.module('core').service('AnchorSmoothScroll', [
    function() {
        this.scrollTo = function(eID) {
            // This scrolling function
            // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

            function currentYPosition() {
                // Firefox, Chrome, Opera, Safari
                if (window.pageYOffset) {
                    return window.pageYOffset;
                }
                // Internet Explorer 6 - standards mode
                if (document.documentElement && document.documentElement.scrollTop)
                    return document.documentElement.scrollTop;
                // Internet Explorer 6, 7 and 8
                if (document.body.scrollTop) return document.body.scrollTop;
                return 0;
            }

            function elmYPosition(eID) {
                var elm = document.getElementById(eID);
                var y = elm.offsetTop;
                var node = elm;
                while (node.offsetParent && node.offsetParent !== document.body) {
                    node = node.offsetParent;
                    y += node.offsetTop;
                } return y;
            }

            var startY = currentYPosition();
            var stopY = elmYPosition(eID)-70;
            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 100) {
                scrollTo(0, stopY); return;
            }
            var speed = Math.round(distance / 100);
            if (speed >= 20) speed = 20;
            var step = Math.round(distance / 25);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;
            if (stopY > startY) {
                for ( var i=startY; i<stopY; i+=step ) {
                    setTimeout('window.scrollTo(0, '+leapY+')', timer * speed);
                    leapY += step; if (leapY > stopY) leapY = stopY; timer++;
                } return;
            }
            for ( var j=startY; j>stopY; j-=step ) {
                setTimeout('window.scrollTo(0, '+leapY+')', timer * speed);
                leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
            }

        };
    }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
    function ($httpProvider) {
        // Set the httpProvider "not authorized" interceptor
        $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
            function ($q, $location, Authentication) {
                return {
                    responseError: function (rejection) {
                        switch (rejection.status) {
                            case 401:
                                // Deauthenticate the global user
                                Authentication.user = null;

                                // Redirect to signin page
                                $location.path('signin');
                                break;
                            case 403:
                                // Add unauthorized behaviour
                                break;
                        }

                        return $q.reject(rejection);
                    }
                };
            }
        ]);
    }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider.
            state('profile', {
                url: '/settings/profile',
                templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
            }).
            state('password', {
                url: '/settings/password',
                templateUrl: 'modules/users/views/settings/change-password.client.view.html'
            }).
            state('accounts', {
                url: '/settings/accounts',
                templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
            }).
            state('signup', {
                url: '/signup',
                templateUrl: 'modules/users/views/authentication/signup.client.view.html'
            }).
            state('signin', {
                url: '/signin',
                templateUrl: 'modules/users/views/authentication/signin.client.view.html'
            }).
            state('forgot', {
                url: '/password/forgot',
                templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
            }).
            state('reset-invlaid', {
                url: '/password/reset/invalid',
                templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
            }).
            state('reset-success', {
                url: '/password/reset/success',
                templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
            }).
            state('reset', {
                url: '/password/reset/:token',
                templateUrl: 'modules/users/views/password/reset-password.client.view.html'
            });
    }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
    function ($scope, $http, $location, Authentication) {
        $scope.authentication = Authentication;

        // If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');

        $scope.signup = function () {
            $http.post('/auth/signup', $scope.credentials).success(function (response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/');
            }).error(function (response) {
                $scope.error = response.message;
            });
        };

        $scope.signin = function () {
            $http.post('/auth/signin', $scope.credentials).success(function (response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/');
            }).error(function (response) {
                $scope.error = response.message;
            });
        };
    }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
    function ($scope, $stateParams, $http, $location, Authentication) {
        $scope.authentication = Authentication;

        //If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');

        // Submit forgotten password account id
        $scope.askForPasswordReset = function () {
            $scope.success = $scope.error = null;

            $http.post('/auth/forgot', $scope.credentials).success(function (response) {
                // Show user success message and clear form
                $scope.credentials = null;
                $scope.success = response.message;

            }).error(function (response) {
                // Show user error message and clear form
                $scope.credentials = null;
                $scope.error = response.message;
            });
        };

        // Change user password
        $scope.resetUserPassword = function () {
            $scope.success = $scope.error = null;

            $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
                // If successful show success message and clear form
                $scope.passwordDetails = null;

                // Attach user profile
                Authentication.user = response;

                // And redirect to the index page
                $location.path('/password/reset/success');
            }).error(function (response) {
                $scope.error = response.message;
            });
        };
    }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
    function ($scope, $http, $location, Users, Authentication) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        // Check if there are additional accounts
        $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
            for (var i in $scope.user.additionalProvidersData) {
                return true;
            }

            return false;
        };

        // Check if provider is already in use with current user
        $scope.isConnectedSocialAccount = function (provider) {
            return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
        };

        // Remove a user social account
        $scope.removeUserSocialAccount = function (provider) {
            $scope.success = $scope.error = null;

            $http.delete('/users/accounts', {
                params: {
                    provider: provider
                }
            }).success(function (response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.user = Authentication.user = response;
            }).error(function (response) {
                $scope.error = response.message;
            });
        };

        // Update a user profile
        $scope.updateUserProfile = function (isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = new Users($scope.user);

                user.$update(function (response) {
                    $scope.success = true;
                    Authentication.user = response;
                }, function (response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        // Change user password
        $scope.changeUserPassword = function () {
            $scope.success = $scope.error = null;

            $http.post('/users/password', $scope.passwordDetails).success(function (response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
            }).error(function (response) {
                $scope.error = response.message;
            });
        };
    }
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

    function () {
        var _this = this;

        _this._data = {
            user: window.user
        };

        return _this._data;
    }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
    function ($resource) {
        return $resource('users', {}, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
