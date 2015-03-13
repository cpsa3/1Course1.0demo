'use strict';

define(['angular'], function(angular) {
    angular.module('components.list.filter', [])
        .filter('hello', ['version', function(version) {
            return function(text) {
                return "hello" + version;
            };
        }]);
});