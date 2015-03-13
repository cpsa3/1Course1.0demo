"use strict";

define(["angular"], function (angular) {
    return angular.module("DemoApp.controllers",[])
        .controller("DemoAppController", [
            "$scope", "$rootScope",
            function ($scope, $rootScope) {
                $scope.test="321";
            }
        ]);
});