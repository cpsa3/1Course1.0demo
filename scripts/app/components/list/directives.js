'use strict';


define(['angular'], function(angular) {
    angular.module('components.list.directive', [])
        .directive('gintList', ['version', function (version) {
            return {
                restrict: 'EA',
                scope: {
                    ngModel: '='
                },
                templateUrl: 'components/list/list.html',
                link: function (scope, iElement, iAttr) {

                }

            };
        }]);
});