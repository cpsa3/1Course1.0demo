"use strict";

define(["angular"], function(angular) {
    return angular.module("Common.services", [])
        .service("helloWorld", function() {
            return function() {
                return "hello world";
            };
        });
});