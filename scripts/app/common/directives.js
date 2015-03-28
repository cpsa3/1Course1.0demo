'use strict';
define(['angular'], function (angular) {
    angular.module('Common.directives', [])
        .directive('pagescroll', ['$timeout',
            function ($timeout) {
                return {
                    restrict: 'A',
                    link: function (scope, iElement, attrs) {
                        iElement.scroll(function (e) {
                            if (iElement.scrollTop() + iElement.innerHeight() >= iElement[0].scrollHeight) {
                                scope.$emit('LoadPageScrollData');
                            }
                        });
                    }
                };
            }
        ]);
});
