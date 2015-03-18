'use strict';

define(['app'], function(app) {

    describe('mainApp/router', function() {

        var $rootScope, $state, $injector, myServiceMock, state = 'myState';
        var $httpBackend;

        beforeEach(function() {

            module('ngTemplates');
            module('CourseCommonApp');


            //preloadTpl('modules/demoapp/demo.html?undefined')

            inject(function(_$rootScope_, _$state_, _$injector_, $templateCache, _$httpBackend_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
                $injector = _$injector_;
                $httpBackend = _$httpBackend_;
                //require or karma by request the template by xxx.html?undefined fuck it!
                $templateCache.put('modules/demoapp/demo.html?undefined','');

                $httpBackend.expectGET('modules/demoapp/demo.html?undefined').respond(200, 'got it!')
            })
        });

        it('index module', function() {
            expect($state.href('index')).toEqual('#/index');
        });

        it('should resolve data', function() {
            $state.go('demo');
            $rootScope.$digest();
            expect($state.current.name).toBe('demo');
        });
    });
});