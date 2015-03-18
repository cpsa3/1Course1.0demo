/*jshint unused: vars */
define(['test'], function(app) {
    'use strict';

    describe('testApp/myState', function() {

        var $rootScope, $state, $injector, myServiceMock, state = 'myState';

        beforeEach(function() {

            module('testApp');

            inject(function(_$rootScope_, _$state_, _$injector_, $templateCache) {
                $rootScope = _$rootScope_;
                $state = _$state_;
                $injector = _$injector_;

                // We need add the template entry into the templateCache if we ever
                // specify a templateUrl
                $templateCache.put('template.html', '');
            })
        });

        it('should respond to URL', function() {
            expect($state.href(state, {
                id: 1
            })).toEqual('#/state/1');
        });

        it('should resolve data', function() {

            $state.go(state);
            $rootScope.$digest();
            expect($state.current.name).toBe(state);

        });
    });
});
