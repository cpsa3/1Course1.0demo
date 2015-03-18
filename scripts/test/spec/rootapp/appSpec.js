'use strict';

define(['app'], function(app) {

    describe('mainApp/router', function() {

        var $rootScope, $state, $injector, myServiceMock, state = 'myState';
        var $httpBackend;

        beforeEach(function() {

            module('ngTemplates');
            module('CourseCommonApp');


            //preloadTpl('modules/index/index.html')
            //module('modules/index/index.html');

            inject(function(_$rootScope_, _$state_, _$injector_, $templateCache, _$httpBackend_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
                $injector = _$injector_;
                $httpBackend = _$httpBackend_;
                $templateCache.put('modules/demoapp/demo.html',
                    '<div>\n' +
                    '    测试测试\n' +
                    '</div>\n' +
                    '\n' +
                    '{{test}}');
                // We need add the template entry into the templateCache if we ever
                // specify a templateUrl
                //$templateCache.put('template.html', '');
                //$templateCache.put('modules/index/index.html', '');
            })
        });

        it('index module', function() {
            expect($state.href('index')).toEqual('#/index');
        });

        // it('should resolve data', function() {

        //     $state.go('demo');
        //     $rootScope.$digest();
        //     expect($state.current.name).toBe('demo');

        // });
    });
});