"use strict";


define([
    "angular",
    'angularRoute',
    "modules/demoapp/directives/directives",
    "modules/demoapp/controller",
    //引入第三方组件或者 自定义业务组件
    "components/list/list",
    "commonServices"
], function(angular, directives, controllers) {
    return angular.module("demoApp", [
        "DemoApp.directives",
        "DemoApp.controllers",
        "ngRoute"
    ]);
});


