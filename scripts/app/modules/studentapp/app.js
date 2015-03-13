"use strict";

define([
    "angular",
    "modules/studentapp/services",
    "modules/studentapp/directives/directives",
    "modules/studentapp/controller",
    //引入第三方组件或者 自定义业务组件
    "components/list/list",
    "commonServices"
], function(angular, services, directives, controllers) {
    return angular.module("studentApp", [
        "studentApp.services",
        "studentApp.directives",
        "studentApp.controllers",
        "components.list"
    ]);
});