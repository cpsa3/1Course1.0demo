"use strict";

define(["angular"], function(angular) {
    return angular.module("EmployeeApp.controllers", [])
        .controller("EmployeeAppController", [
            "$scope", "$rootScope",
            function($scope, $rootScope) {
                $scope.test = "321";
            }
        ]);
});
