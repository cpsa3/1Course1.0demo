/*jshint unused: vars */
define(['app'], function(app) {
    'use strict';


    describe("first test", function() {
        it("should failed", function() {
            expect(3).toBe(3);
        });
    });

    describe('Controller: CommonController', function() {

        // load the controller's module
        beforeEach(module('CourseCommonApp'));

        var Ctrl,
            scope;

        // Initialize the controller and a mock scope
        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            Ctrl = $controller('CommonController', {
                $scope: scope
            });
        }));

        it('should attach a list of awesomeThings to the scope', function() {
            expect(scope.navdemo).toBe(123);
        });
    });
});
