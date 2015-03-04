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
        'CourseCommonApp': "common/app",
        'services': "common/services",
        'controller': "common/controller",
        //子模块入口文件 子模块引入在此补充
        'student': "studentapp/app",
        'demo': "demoapp/app"
    },
    shim: {
        CourseCommonApp: [
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
    "CourseCommonApp"
], function () {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ["CourseCommonApp"]);
    });
});



