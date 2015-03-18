"use strict";

define([
    "angular",
    "uiRouter"
], function(angular, directives, controllers) {
    return angular.module('testApp', ['ui.router'])
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('myState', {
                url: '/state/:id',
                templateUrl: 'template.html',
                controller: 'MyCtrl'
            });
        }]);
});
