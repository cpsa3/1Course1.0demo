'use strict'

module.exports = function(grunt) {
    // Load grunt tasks automatically  
    //require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: 'checkstyle', //require('jshint-stylish'),
                reporterOutput: 'tmp/jshint-report.xml',
                force: true
            },
            all: ['app/modules/**/*.js']
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            toot: {
                options: {
                    sourceMap: false,
                    sourceMapName: 'dest/sourcemap.map',
                },
                files: {
                    'dest/toot/toot-0.2.0.min.js': ['app/mylibs/toot/toot-0.2.0/*.js'],
                    'dest/toot/toot-0.1.1.min.js': ['app/mylibs/toot/toot-0.1.1/*.js']
                }
            },
            bizcmpts: {
                options: {
                    sourceMap: false,
                    sourceMapName: 'dest/sourcemap.map',
                },
                files: {
                    'dest/bizcmpts/businesscomponents-0.1.11.min.js': ['app/mylibs/bizcmpts/businesscomponents-0.1.11/*.js'],
                    'dest/bizcmpts/businesscomponents-1.2.4.min.js': ['app/mylibs/bizcmpts/businesscomponents-1.2.4/*.js']
                }
            }
        },
        // Optimize RequireJS projects using r.js.
        requirejs: {
            compile: {
                options: {
                    mainConfigFile: "app/main.js",
                    baseUrl: "app",
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
                            name: "app",
                            exclude: [
                                "jquery",
                                "angular",
                                "uiRouter"
                            ]
                        }
                    ]
                }
            }
        },
        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            js: {
                //expand: true,
                src: [
                    'dist/*.js'
                ],
                //dest: 'tmp'
            }
        },
        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'tmp'
            }
        },
        usemin: {
            html : {
                files : [{
                        src : 'dist/index.html'
                    }
                ]
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('release', ['uglify', 'requirejs']);
    grunt.registerTask('build', ['useminPrepare', 'filerev', 'usemin']);

};
