'use strict';

define(['app'], function(app) {

    describe('mainApp/router', function() {

        var $rootScope, $state, $injector, myServiceMock, state = 'myState';

        beforeEach(function() {

            module('CourseCommonApp');
            module('ngMockE2E');

            inject(function(_$rootScope_, _$state_, _$injector_, $templateCache) {
                $rootScope = _$rootScope_;
                $state = _$state_;
                $injector = _$injector_;

                // We need add the template entry into the templateCache if we ever
                // specify a templateUrl
                $templateCache.put('template.html', '');
                $templateCache.put('modules/index/index.html', '');
            })
        });

        it('index module', function() {
            expect($state.href('index')).toEqual('#/index');
        });

        it('should resolve data', function() {

            $state.go('index');
            $rootScope.$digest();
            expect($state.current.name).toBe('index');

        });
    });
});
