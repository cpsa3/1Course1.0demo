"use strict";

define([
    "angular",
    "modules/demoapp/controller",
    "components/list/list",
    "commonServices"
], function(angular, directives, controllers) {
    return angular.module("demoApp", [
        "DemoApp.controllers"
    ]);
});