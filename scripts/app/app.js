"use strict";

define([
    "angular",
    "uiRouter",
    "rootController",
    "rootConfig",
    "rootRoutes",
    "commonFilters",
    "commonServices",
    "modules/index/app",
    "modules/studentapp/app",
    'modules/demoapp/app'
], function (angular, services, controllers) {
    return angular.module("CourseCommonApp", [
        "ui.router",
        "CourseCommonApp.controllers",
        "CourseCommonApp.configs",
        "CourseCommonApp.routes",
        //注入子模块
        "indexApp",
        "studentApp",
        "demoApp"
    ])
});