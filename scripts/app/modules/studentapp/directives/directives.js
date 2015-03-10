"use strict";


define(["angular"], function(angular) {
    angular.module("studentApp.directives", [])
        //课程容器指令
        .directive("helloWorld", [
            "$window", "$timeout",
            function($window, $timeout) {
                return {
                    restrict: 'EA',
                    template: "<div>hello world Student</div>",
                    link: function(scope, iElement, iAttr) {}
                }
            }
        ])
});
