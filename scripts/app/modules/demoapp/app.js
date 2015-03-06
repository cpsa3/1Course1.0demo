"use strict";


define([
    "angular",
    'angularRoute',
    "modules/demoapp/directives/directives",
    "modules/demoapp/controller"
], function(angular, directives, controllers) {

    return angular.module("demoApp", [
        "DemoApp.directives",
        "DemoApp.controllers",
        "ngRoute"
    ]).config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider.when('/demo', {
                templateUrl: 'modules/demoapp/demo.html',
                controller: 'DemoAppController'
            });

        }
    ]);
});


