"use strict";

define([
    "angular",
    "modules/index/controller",
], function(angular, directives, controllers) {
    return angular.module("indexApp", [
        "IndexApp.controller"
    ]);
});