"use strict";
/**
 * author :小潘
 * time: 2015年3月3日 17:45:17
 * description:  主入口控制器 放置核心业务处理函数
 */

define(["angular", "rootServices"], function(angular) {
    return angular.module("CourseCommonApp.controllers", ["CourseCommonApp.services"])
        .controller("CommonController", [
            "$scope", "$rootScope", "$window", "helloWorld",
            function($scope, $rootScope, $window, helloWorld) {

                var x = helloWorld();

                $scope.navModel = [{
                    url: "index.html#/student",
                    view: "学员管理"
                }, {
                    url: "index.html#/demo",
                    view: "测试"
                }];
                $scope.navdemo = 123;
            }
        ]);
});
