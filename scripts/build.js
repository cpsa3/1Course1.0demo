({
    mainConfigFile : "app/main.js",
    baseUrl : "app",
    //name: "main",
    //out: "dist/main.js",
    removeCombined: true,
    findNestedDependencies: true,
    dir: "dist",
    modules: [
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