"use strict";

define(["angular"], function(angular) {
    return angular.module("IndexApp.controller", ['Common.services'])
        .controller("IndexAppController", [
            "$scope", "$rootScope", 'messageBus',
            function($scope, $rootScope, messageBus) {
                $scope.desp = "this is index page.";

                var data = [{
                    url: "student",
                    view: "学员管理1"
                }, {
                    url: "demo",
                    view: "测试1"
                }];
                messageBus.publish('index.load', data);
                data[0].view = 'xxx';
            }
        ]);
});
