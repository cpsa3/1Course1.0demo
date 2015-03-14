"use strict";
/**
 * author :小潘
 * time: 2015年3月3日 17:45:17
 * description:  主入口控制器 放置核心业务处理函数
 */

define(["angular"], function(angular) {
    return angular.module("CourseCommonApp.controllers", [])
        .controller("CommonController", [
            "$scope", "$rootScope", "$window",
            function($scope, $rootScope, $window) {

                $scope.navModel = [{
                    url: "student",
                    view: "学员管理"
                }, {
                    url: "demo",
                    view: "测试"
                }];
                $scope.navdemo = 123;
            }
        ]);
});
