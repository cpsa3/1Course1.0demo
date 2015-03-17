"use strict";

define(["angular"], function(angular) {
    return angular.module("IndexApp.controller", ['Common.services'])
        .controller("IndexAppController", [
            "$scope", "$rootScope", 'messageBus', '$filter',
            function($scope, $rootScope, messageBus, $filter) {
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
            }
        ]);
});
