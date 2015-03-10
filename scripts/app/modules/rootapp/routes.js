"use strict";

/**
 * 主程序路由设置
 *
 */
define(["angular", "angularRoute"], function(angular) {
    return angular.module("CourseCommonApp.routes", ['ngRoute'])
        .config(["$routeProvider", function($routeProvider) {
            $routeProvider
                .when('/demo', {
                    templateUrl: 'modules/demoapp/demo.html',
                    controller: 'DemoAppController'
                })
                .when('/student', {
                    templateUrl: 'modules/studentapp/student.html',
                    controller: 'StudentAppController'
                })
                .otherwise({
                    redirectTo: '/student'
                });
        }]);
});
