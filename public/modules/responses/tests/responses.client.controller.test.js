'use strict';

(function () {
    // Responses Controller Spec
    describe('Responses Controller Tests', function () {
        // Initialize global variables
        var ResponsesController,
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

            // Initialize the Responses controller.
            ResponsesController = $controller('ResponsesController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create an array with at least one Response object fetched from XHR', inject(function (Responses) {
            // Create sample Response using the Responses service
            var sampleResponse = new Responses({
                name: 'New Response'
            });

            // Create a sample Responses array that includes the new Response
            var sampleResponses = [sampleResponse];

            // Set GET response
            $httpBackend.expectGET('responses').respond(sampleResponses);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.responses).toEqualData(sampleResponses);
        }));

        it('$scope.findOne() should create an array with one Response object fetched from XHR using a responseId URL parameter', inject(function (Responses) {
            // Define a sample Response object
            var sampleResponse = new Responses({
                name: 'New Response'
            });

            // Set the URL parameter
            $stateParams.responseId = '525a8422f6d0f87f0e407a33';

            // Set GET response
            $httpBackend.expectGET(/responses\/([0-9a-fA-F]{24})$/).respond(sampleResponse);

            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.response).toEqualData(sampleResponse);
        }));

        it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function (Responses) {
            // Create a sample Response object
            var sampleResponsePostData = new Responses({
                name: 'New Response'
            });

            // Create a sample Response response
            var sampleResponseResponse = new Responses({
                _id: '525cf20451979dea2c000001',
                name: 'New Response'
            });

            // Fixture mock form input values
            scope.name = 'New Response';

            // Set POST response
            $httpBackend.expectPOST('responses', sampleResponsePostData).respond(sampleResponseResponse);

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test form inputs are reset
            expect(scope.name).toEqual('');

            // Test URL redirection after the Response was created
            expect($location.path()).toBe('/responses/' + sampleResponseResponse._id);
        }));

        it('$scope.update() should update a valid Response', inject(function (Responses) {
            // Define a sample Response put data
            var sampleResponsePutData = new Responses({
                _id: '525cf20451979dea2c000001',
                name: 'New Response'
            });

            // Mock Response in scope
            scope.response = sampleResponsePutData;

            // Set PUT response
            $httpBackend.expectPUT(/responses\/([0-9a-fA-F]{24})$/).respond();

            // Run controller functionality
            scope.update();
            $httpBackend.flush();

            // Test URL location to new object
            expect($location.path()).toBe('/responses/' + sampleResponsePutData._id);
        }));

        it('$scope.remove() should send a DELETE request with a valid responseId and remove the Response from the scope', inject(function (Responses) {
            // Create new Response object
            var sampleResponse = new Responses({
                _id: '525a8422f6d0f87f0e407a33'
            });

            // Create new Responses array and include the Response
            scope.responses = [sampleResponse];

            // Set expected DELETE response
            $httpBackend.expectDELETE(/responses\/([0-9a-fA-F]{24})$/).respond(204);

            // Run controller functionality
            scope.remove(sampleResponse);
            $httpBackend.flush();

            // Test array after successful delete
            expect(scope.responses.length).toBe(0);
        }));
    });
}());
