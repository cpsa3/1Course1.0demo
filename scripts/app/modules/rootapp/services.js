"use strict";

define(["angular"], function (angular) {
    return angular.module("CourseCommonApp.services",[]).service("helloWorld", function () {
        return function(){
            return "hello world";
        };
    });
});