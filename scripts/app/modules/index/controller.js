"use strict";

define(["angular", 'ngDialog'], function (angular) {
    return angular.module("IndexApp.controller", ['Common.services', 'ngDialog'])
        .controller("IndexAppController", [
            "$scope", "$rootScope", 'messageBus', '$filter', 'ngDialog',
            function ($scope, $rootScope, messageBus, $filter, ngDialog) {
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

                $scope.open = function () {
                    ngDialog.openConfirm({
                        template: 'common/templates/dialogs/simpleDialog.html',
                        data: {
                            title: '提醒',
                            message: '确认删除：老狗等人？',
                        }
                        //scope: $scope
                    }).then(function (value) {
                        console.log('Modal promise resolved. Value: ', value);
                    }, function (reason) {
                        console.log('Modal promise rejected. Reason: ', reason);
                    });
                };
            }
        ]);
});
