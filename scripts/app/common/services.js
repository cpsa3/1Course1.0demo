"use strict";

define(["angular"], function(angular) {
    return angular.module("Common.services", [])
        .service("helloWorld", function() {
            return function() {
                return "hello world";
            };
        })
        .service('messageService', ['$rootScope', function($rootScope) {
            var sharedService = {};

            sharedService.publish = function(msg, data) {
                data = data || {};
                $rootScope.$broadcast(msg, data);
            };

            sharedService.subscribe = function(msg, scope, func) {
                scope.$on(msg, func);
            };

            return sharedService;
        }])
        .service('messageBus', ['$rootScope', function($rootScope) {
            var messageBus = {};

            messageBus.publish = function(msg, data) {
                data = data || {};
                $rootScope.$emit(msg, data);
            };

            messageBus.subscribe = function(msg, scope, func) {
                var unbind = $rootScope.$on(msg, func);
                if (scope) {
                    scope.$on('$destroy', unbind);
                }
                return unbind;
            };

            return messageBus;
        }]);
});