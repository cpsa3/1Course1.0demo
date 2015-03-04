"use strict";


define([
    "angular",
    'angularRoute',
    "demoapp/directives/directives",
    "demoapp/controller"
], function(angular, directives, controllers) {

    return angular.module("demoApp", [
        "DemoApp.directives",
        "DemoApp.controllers"
    ]).config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider.when('/demo', {
                templateUrl: 'demoapp/demo.html',
                controller: 'DemoAppController'
            });

        }
    ]);
});


