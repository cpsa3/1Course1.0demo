var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        // Removed "Spec" naming from files
        if (/Spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}
requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/app/',

    paths: {
        jquery: 'libs/jquery/dist/jquery.min',
        angular: 'libs/angular/angular',
        angularMocks: 'libs/angular-mocks/angular-mocks',
        uiRouter: "libs/angular-ui-router/release/angular-ui-router",
        //'app': 'app',
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
        app: [
            'angularMocks'
        ],
        angular: {
            'deps': ['jquery'],
            'exports': 'angular'
        },
        angularMocks: ['angular'],
        uiRouter: ["angular"]
    },
    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
