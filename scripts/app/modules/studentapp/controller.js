"use strict";


define(["angular", "./services"], function (angular) {
    return angular.module("studentApp.controllers", ["studentApp.services"])
        .controller("StudentAppController", [
            "$scope", "$rootScope", "hello",
            function ($scope, $rootScope, helloWorld) {

                $scope.test = helloWorld();
                var state = $scope.$state;

                $scope.listModel = [
                    {
                        name: "老狗1",
                        phone: "1877777777"
                    },
                    {
                        name: "老狗2",
                        phone: "1877777777"
                    },
                    {
                        name: "老狗3",
                        phone: "1877777777"
                    },
                    {
                        name: "老狗5",
                        phone: "1877777777"
                    }
                    , {
                        name: "老狗6",
                        phone: "1877777777"
                    }, {
                        name: "老狗7",
                        phone: "1877777777"
                    },
                    {
                        name: "老狗8",
                        phone: "1877777777"
                    },
                    {
                        name: "老狗9",
                        phone: "1877777777"
                    }


                ]
            }
        ]);
});