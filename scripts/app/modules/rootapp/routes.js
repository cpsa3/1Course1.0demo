"use strict";

/**
 * 主程序路由设置(使用angular-ui-router:https://github.com/angular-ui/ui-router)
 */
define(["angular", "uiRouter"], function(angular) {
    return angular.module("CourseCommonApp.routes", ['ui.router'])
        .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/student");

            $stateProvider
                .state('demo', {
                    url: "/demo",
                    templateUrl: "modules/demoapp/demo.html",
                    controller: 'DemoAppController'
                })
                .state('student', {
                    url: "/student",
                    templateUrl: "modules/studentapp/student.html",
                    controller: 'StudentAppController'
                })
                .state('student.add', {
                    url: "/add",
                    templateUrl: "modules/studentapp/student.add.html",
                    //controller: 'StudentAppAddController'
                })
                .state('index', {
                    url: "/index",
                    templateUrl: "modules/index/index.html",
                    controller: 'IndexAppController'
                });
        }])
        .run(['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]);
});