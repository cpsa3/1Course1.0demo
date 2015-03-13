'use strict';

define(['angular', 'components/list/directives', 'components/list/filter'],
    function(angular, directive, filter) {
        angular.module('components.list', [
                'components.list.directive',
                'components.list.filter'
            ])
            //建议自定义共用组件都增加版本号
            .value('version', '0.1');
    });