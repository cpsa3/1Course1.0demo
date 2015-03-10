"use strict";
/**
 * author :小潘
 * time: 2015年3月3日 14:42:19
 * description: 主入口文件， 串联起所有子模块
 */

define([
    "angular",
    "angularRoute",
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
        "ngRoute",
        "CourseCommonApp.controllers",
        "CourseCommonApp.services",
        "CourseCommonApp.configs",
        "CourseCommonApp.routes",
        //注入子模块
        "studentApp",
        "demoApp"
    ])
});