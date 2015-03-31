"use strict";

define([
    "angular",
    "modules/index/controller",
    "components/paging/directive"
], function(angular, directives, controllers) {
    return angular.module("indexApp", [
        "IndexApp.controller",
        "brantwills.paging"
    ]);
});