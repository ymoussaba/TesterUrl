'use strict';

(function () {
    // Urls Controller Spec
    describe('Urls Controller Tests', function () {
        // Initialize global variables
        var UrlsController,
            scope,
            $httpBackend,
            $stateParams,
            $location;

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function () {
            jasmine.addMatchers({
                toEqualData: function (util, customEqualityTesters) {
                    return {
                        compare: function (actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Then we can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            // Initialize the Urls controller.
            UrlsController = $controller('UrlsController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create an array with at least one Url object fetched from XHR', inject(function (Urls) {
            // Create sample Url using the Urls service
            var sampleUrl = new Urls({
                name: 'New Url'
            });

            // Create a sample Urls array that includes the new Url
            var sampleUrls = [sampleUrl];

            // Set GET response
            $httpBackend.expectGET('urls').respond(sampleUrls);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.urls).toEqualData(sampleUrls);
        }));

        it('$scope.findOne() should create an array with one Url object fetched from XHR using a urlId URL parameter', inject(function (Urls) {
            // Define a sample Url object
            var sampleUrl = new Urls({
                name: 'New Url'
            });

            // Set the URL parameter
            $stateParams.urlId = '525a8422f6d0f87f0e407a33';

            // Set GET response
            $httpBackend.expectGET(/urls\/([0-9a-fA-F]{24})$/).respond(sampleUrl);

            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.url).toEqualData(sampleUrl);
        }));

        it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function (Urls) {
            // Create a sample Url object
            var sampleUrlPostData = new Urls({
                name: 'New Url'
            });

            // Create a sample Url response
            var sampleUrlResponse = new Urls({
                _id: '525cf20451979dea2c000001',
                name: 'New Url'
            });

            // Fixture mock form input values
            scope.name = 'New Url';

            // Set POST response
            $httpBackend.expectPOST('urls', sampleUrlPostData).respond(sampleUrlResponse);

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test form inputs are reset
            expect(scope.name).toEqual('');

            // Test URL redirection after the Url was created
            expect($location.path()).toBe('/urls/' + sampleUrlResponse._id);
        }));

        it('$scope.update() should update a valid Url', inject(function (Urls) {
            // Define a sample Url put data
            var sampleUrlPutData = new Urls({
                _id: '525cf20451979dea2c000001',
                name: 'New Url'
            });

            // Mock Url in scope
            scope.url = sampleUrlPutData;

            // Set PUT response
            $httpBackend.expectPUT(/urls\/([0-9a-fA-F]{24})$/).respond();

            // Run controller functionality
            scope.update();
            $httpBackend.flush();

            // Test URL location to new object
            expect($location.path()).toBe('/urls/' + sampleUrlPutData._id);
        }));

        it('$scope.remove() should send a DELETE request with a valid urlId and remove the Url from the scope', inject(function (Urls) {
            // Create new Url object
            var sampleUrl = new Urls({
                _id: '525a8422f6d0f87f0e407a33'
            });

            // Create new Urls array and include the Url
            scope.urls = [sampleUrl];

            // Set expected DELETE response
            $httpBackend.expectDELETE(/urls\/([0-9a-fA-F]{24})$/).respond(204);

            // Run controller functionality
            scope.remove(sampleUrl);
            $httpBackend.flush();

            // Test array after successful delete
            expect(scope.urls.length).toBe(0);
        }));
    });
}());
