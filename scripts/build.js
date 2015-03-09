({
    mainConfigFile : "app/main.js",
    baseUrl : "app",
    //name: "main",
    //out: "dist/main.js",
    removeCombined: true,
    findNestedDependencies: true,
    dir: "dist",
    modules: [
        /*
        {
            name: "modules/demoapp/app",
            exclude: [
                "jquery",
                "angular",
                "angularRoute"
            ]
        },
        {
            name: "modules/studentapp/app",
            exclude: [
                "jquery",
                "angular",
                "angularRoute"
            ]
        }
        */
       {
            name: "main",
            exclude: [
                "jquery",
                "angular",
                "angularRoute"
            ]
        }
    ]
})