"use strict";


define([
    "angular",
    'angularRoute',
    "modules/demoapp/directives/directives",
    "modules/demoapp/controller",
    "commonServices"
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


