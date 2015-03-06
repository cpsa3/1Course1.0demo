"use strict";


define([
    "angular",
    'angularRoute',
    "modules/employeeapp/controller"
], function(angular) {

    return angular.module("employeeApp", [
        "EmployeeApp.controllers",
        "ngRoute"
    ]);
});


