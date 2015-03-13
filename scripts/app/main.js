requirejs.config({
    paths: {
        jquery: "libs/jquery/dist/jquery.min",
        angular: "libs/angular/angular",
        uiRouter: "libs/angular-ui-router/release/angular-ui-router",

        rootServices: "modules/rootapp/services",
        rootController: "modules/rootapp/controller",
        rootConfig: "modules/rootapp/config",
        rootRoutes: "modules/rootapp/routes",

        commonFilters: "common/filters",
        commonServices: "common/services",

        //子模块入口文件 子模块引入在此补充
        student: "modules/studentapp/app",
        demo: "modules/demoapp/app"
    },
    shim: {
        angular: {
            'deps': ["jquery"],
            'exports': "angular"
        },
        uiRouter: ["angular"]
    }
});

require([
    "app"
], function() {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ["CourseCommonApp"]);
    });
});