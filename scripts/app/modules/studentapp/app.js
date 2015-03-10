"use strict";
/**
 * author :小潘
 * time: 2015年3月3日 17:48:41
 * description: 子模块的-程序入口   希望每个模块都可自成体系
 */

define([
    "angular",
    'angularRoute',
    "modules/studentapp/services",
    "modules/studentapp/directives/directives",
    "modules/studentapp/controller",
    //引入第三方组件或者 自定义业务组件
    "components/list/list",
    "commonServices"
], function (angular, services, directives, controllers) {

    return angular.module("studentApp", [
        "ngRoute",
        "studentApp.services",
        "studentApp.directives",
        "studentApp.controllers",
        "components.list"
    ]);
});