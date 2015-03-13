"use strict";

define([
    "angular",
    "uiRouter",
    "rootServices",
    "rootController",
    "rootConfig",
    "rootRoutes",
    "commonFilters",
    "commonServices",
    "student",
    'demo'
], function (angular, services, controllers) {
    return angular.module("CourseCommonApp", [
        "ui.router",
        "CourseCommonApp.controllers",
        "CourseCommonApp.services",
        "CourseCommonApp.configs",
        "CourseCommonApp.routes",
        //注入子模块
        "studentApp",
        "demoApp"
    ])
});