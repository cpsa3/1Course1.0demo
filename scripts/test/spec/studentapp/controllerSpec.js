/*jshint unused: vars */
define(['app'], function(app) {
    'use strict';

    describe('Controller: StudentAppController', function() {

        // load the controller's module
        beforeEach(module('studentApp'));

        var Ctrl,
            scope;

        // Initialize the controller and a mock scope
        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            Ctrl = $controller('StudentAppController', {
                $scope: scope
            });
        }));

        it('should attach a list of awesomeThings to the scope', function() {
            expect(scope.listModel.length).toBe(8);
        });
    });
});
