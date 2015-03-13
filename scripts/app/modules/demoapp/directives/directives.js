"use strict";

define(["angular"], function(angular) {
    angular.module("DemoApp.directives", [])
        .directive("helloWorld", [
            "$window", "$timeout",
            function($window, $timeout) {
                return {
                    restrict: 'EA',
                    template: "<div>hello world Demo</div>",
                    link: function(scope, iElement, iAttr) {

                    }
                };
            }
        ]);
});