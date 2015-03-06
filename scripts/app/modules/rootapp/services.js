"use strict";
/**
 * author :小潘
 * time: 2015年3月3日 14:52:44
 * description: 主入口公用函数  请求权限配置表在此发起请求
 */


define(["angular"], function (angular) {
    return angular.module("CourseCommonApp.services",[]).service("helloWorld", function () {
        return function(){
            return "hello world";
        }
    })
});