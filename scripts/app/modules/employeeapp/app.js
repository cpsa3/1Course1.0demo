"use strict";


define([
    "angular",
    'angularRoute',
    "employeeapp/controller"
], function(angular) {

    return angular.module("employeeApp", [
        "EmployeeApp.controllers",
        "ngRoute"
    ]);
});


