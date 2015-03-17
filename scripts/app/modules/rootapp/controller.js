"use strict";

define(["angular"], function(angular) {
    return angular.module("CourseCommonApp.controllers", ['Common.services'])
        .controller("CommonController", [
            "$scope", "$rootScope", "$window", 'messageBus',
            function($scope, $rootScope, $window, messageBus) {

                $scope.navModel = [{
                    url: "student",
                    view: "学员"
                }, {
                    url: "demo",
                    view: "测试"
                }, {
                    url: "index",
                    view: "首页"
                }];
                
                $scope.navdemo = 123;

                //订阅index.load事件
                var unsubcribe = messageBus.subscribe('index.load', $scope, function(event, data) {
                    $scope.navModel = data;
                    //首次触发后取消订阅
                    unsubcribe();
                });

            }
        ]);
});
