/*jshint unused: vars */
define(['app'], function(app) {
    'use strict';

    describe('Controller: DemoAppController', function() {

        // load the controller's module
        beforeEach(module('demoApp'));

        var Ctrl,
            scope;

        // Initialize the controller and a mock scope
        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            Ctrl = $controller('DemoAppController', {
                $scope: scope
            });
        }));

        it('should attach a list of awesomeThings to the scope', function() {
            expect(scope.test).toBe('321');
        });
    });
});
