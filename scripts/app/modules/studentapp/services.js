"use strict";


define(["angular"], function (angular) {
    angular.module("studentApp.services", [])
        //获取单个课程数据
        .service("hello",
     function () {
        return function(){
            return  "hello"
        }
    }
    )

});