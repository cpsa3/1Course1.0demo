/**
 * author :小潘
 * time: 2014年12月15日 21:45:16
 * description:  整站仅有一个，避免再次创建，方便发布、压缩、合并
 */

requirejs.config({
    //baseUrl: '/1Course1.0demo/scripts/app',
    paths: {
        'jquery': "libs/jquery/dist/jquery.min",
        'angular': "libs/angular/angular",
        "angularRoute": "libs/angular-route/angular-route",
        'rootApp': "app",
        'services': "modules/rootapp/services",
        'controller': "modules/rootapp/controller",
        //子模块入口文件 子模块引入在此补充
        'student': "modules/studentapp/app",
        'demo': "modules/demoapp/app"
    },
    shim: {
        rootApp: [
            "jquery"
        ],
        angular: {
            'deps': ["jquery"],
            'exports': "angular"
        },
        angularRoute: ["angular"]
    }
});

require([
    "rootApp"
], function () {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ["CourseCommonApp"]);
    });
});



