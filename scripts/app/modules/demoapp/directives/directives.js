"use strict";


define(["angular"], function (angular) {
    angular.module("DemoApp.directives", [])
        //课程容器指令
        .directive("helloWorld", [
            "$window", "$timeout", function ($window, $timeout) {
                return {
                    restrict: 'EA',
                    template: "<div>hello world Demo</div>",
                    link: function (scope, iElement, iAttr) {


                    }

                }
            }]
    )

});

