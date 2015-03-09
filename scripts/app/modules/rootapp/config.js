"use strict";

/**
 * 主程序配置文件(http全局处理,路由设置,全局的Constant Value)
 * 
 */
define(["angular", "angularRoute"], function(angular) {
    return angular.module("CourseCommonApp.configs", ['ngRoute'])
        .value("version", "0.1")
        .constant("projectName", "Demo")
        // 对请求中html文件 做非缓存处理
        // 全局HTTP处理
        .config(["$httpProvider", function($httpProvider) {
            $httpProvider.interceptors.push(['$q', '$rootScope', function($q, $rootScope) {
                return {
                    request: function(config) {
                        //监控Angularjs get请求 如果请求地址含有html文件，则给其加版本戳，已防止缓存
                        var urlArgs = "version=" + (new Date()).getTime();
                        if (typeof(requirejs) != "undefined") {
                            urlArgs = requirejs.s.contexts._.config.urlArgs;
                        }
                        if (config.method == 'GET') {
                            if (config.url.indexOf('.htm') !== -1) {
                                var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                                config.url = config.url + separator + urlArgs;
                            }
                        }
                        return config;
                    },
                    responseError: function(response) {
                        switch (response.status) {
                            case 497:
                                //你无权进行该操作
                                alert("无权操作");
                                break;
                            case 498:
                                alert("会话超时，请重新登录");
                                break;
                            case 499:
                            case 500:
                                alert("未知错误，通知系统管理员");
                                break;
                            default:
                                break;
                        }
                        return $q.reject(response);
                    }
                };
            }]);
        }]);
});
