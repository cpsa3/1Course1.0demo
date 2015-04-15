requirejs.config({
    paths: {
        jquery: "libs/jquery/dist/jquery.min",
        angular: "libs/angular/angular",
        ngDialog: "libs/ngDialog/js/ngDialog",
        uiRouter: "libs/angular-ui-router/release/angular-ui-router",

        rootController: "modules/rootapp/controller",
        rootConfig: "modules/rootapp/config",
        rootRoutes: "modules/rootapp/routes",

        commonFilters: "common/filters",
        commonServices: "common/services",
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