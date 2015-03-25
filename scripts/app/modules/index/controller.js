"use strict";

define(["angular", 'ngDialog'], function (angular) {
    return angular.module("IndexApp.controller", ['Common.services', 'ngDialog'])
        .controller("IndexAppController", [
            "$scope", "$rootScope", 'messageBus', '$filter', 'ngDialog', '$timeout',
            function ($scope, $rootScope, messageBus, $filter, ngDialog, $timeout) {
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
                    var dialog = ngDialog.openConfirm({
                        data: {
                            title: '提醒',
                            message: '确认删除：老狗等人？',
                        }
                    }).then(function (value) {
                        console.log('Modal promise resolved. Value: ', value);
                    }, function (reason) {
                        console.log('Modal promise rejected. Reason: ', reason);
                    });


                    //1s 后自动关闭
                    $timeout(function () {
                        ngDialog.close();
                    }, 1000);
                };

            }
        ]);
});
