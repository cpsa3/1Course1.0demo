"use strict";

define([
    "angular",
    'common/services/dialogService',
    'ngDialog',
    'commonServices'
], function (angular) {
    return angular.module("IndexApp.controller", ['Common.services', 'Dialog.services', 'ngDialog'])
        .controller("IndexAppController", [
            "$scope", "$rootScope", 'messageBus', '$filter', 'gintDialog', 'ngDialog', '$timeout', 'format',
            function ($scope, $rootScope, messageBus, $filter, gintDialog, ngDialog, $timeout, format) {
                $scope.desp = "this is index page.";


                var currentTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

                var data = [{
                    url: "student",
                    view: "学员 - " + currentTime
                }, {
                    url: "demo",
                    view: "测试 - " + currentTime
                }, {
                    url: "index",
                    view: "首页 - " + currentTime
                }];
                messageBus.publish('index.load', data);

                $scope.confirm = function () {
                    gintDialog.confirm('提醒', '确认删除 张三丰 等人？', function (value) {
                        console.log('Modal promise resolved. Value1: ', value);
                    }, function (reason) {
                        console.log('Modal promise rejected. Reason1: ', reason);
                    });
                };

                $scope.success = function () {
                    gintDialog.success('操作成功', 2000);
                };

                $scope.error = function () {
                    gintDialog.error('登录名为6位及以上字母、数字、下划线的任意组合。', 10000);
                };

                //paging 
                $scope.currentPage = 9;
                $scope.pageSize = 10;
                $scope.total = 1000;
                $scope.changePage = function (text, page) {
                    console.log(text, page);
                };
            }
        ]);
});
