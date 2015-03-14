"use strict";

define(["angular"], function (angular) {
    return angular.module("IndexApp.controller",[])
        .controller("IndexAppController", [
            "$scope", "$rootScope",
            function ($scope, $rootScope) {
                $scope.desp="this is index page.";
            }
        ]);
});