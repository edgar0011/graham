module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    var options = {
        config : {
            src: "grunt/*.js",
            mock:false
        }
    };

    // Load tasks into the Grunt
    var externalConfigs = require('load-grunt-configs')(grunt, options);

    grunt.initConfig(externalConfigs);

    // Build configuration
    var config = {
        app: 'app', //application source code folder
        dist: 'dist', //application distribution folder
        temp: 'temp' //temp dir for concat, uglify
    };

    grunt.extendConfig({
        config:config,
        pkg: grunt.file.readJSON('package.json'),


        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: ['<%= config.dist %>/*']
                    }
                ]
            },
            release: {
                files: [
                    {
                        dot: true,
                        src: [
                            'temp',
                            '<%= config.dist %>/temp',
                            '<%= config.dist %>/**/*.js',
                            '!<%= config.dist %>/*.js',
                            '!<%= config.dist %>/*.min.js',
                            '<%= config.dist %>/components',
                            '<%= config.dist %>/modules',
                            '!<%= config.dist %>/assets/**/*.js'

                        ]
                    }
                ]
            },
            docs: {
                files: [
                    {src: "docs"}
                ]
            }

        },

        concat: {
            options: {
                separator: ';\n'
            },
            dist: {
                src: [
                    '<%= config.dist %>/<%= config.temp %>/bower/**/*.js',
                    '<%= config.dist %>/<%= config.temp %>/components/**/*.js',
                    '<%= config.dist %>/<%= config.temp %>/modules/*/*.js',
                    '<%= config.dist %>/<%= config.temp %>/modules/*/*/*.js',
                    '<%= config.dist %>/<%= config.temp %>/app.js',
                    '<%= config.dist %>/<%= config.temp %>/*AppController.js',
                    '<%= config.dist %>/<%= config.temp %>/**/*.js'
                ],
                dest: '<%= config.dist %>/<%= config.temp %>/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                mangle: false,
                flatten: true
            },
            dist: {
                files: {
                    '<%= config.dist %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },


        ngtemplates:  {
            "ngCore":        {
                cwd:      '<%= config.app %>',
                src:      ['components/**/*.html', 'modules/**/*.html'],
                dest:     '<%= config.dist %>/<%= config.temp %>/app.templates.js'
            }
        },

        wrap: {
            default: {
                src: ['<%= config.dist %>/components/**/*.js', '<%= config.dist %>/modules/**/*.js'],
                dest: "",
                options: {
                    wrapper: ['(function () {\n\'use strict\'; \n', '\n})();']
                }
            },

            release: {
                src: ['<%= config.dist %>/<%= config.temp %>/components/**/*.js', '<%= config.dist %>/<%= config.temp %>/modules/**/*.js'],
                dest: "",
                options: {
                    wrapper: ['(function () {\n\'use strict\'; \n', '\n})();']
                }
            }
        },

        jshint: {
            files: ['Gruntfile.js', '<%= config.app %>/components/**/*.js', '<%= config.app %>/modules/**/*.js', '<%= config.app %>/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            default: {
                files: [
                    {
                        expand: true,
                        src: ['<%= config.dist %>/components/**/*.js', '<%= config.dist %>/modules/**/*.js'],
                        extDot: 'last'      // Extensions in filenames begin after the last dot
                    }
                ]
            },
            release: {
                files: [
                    {
                        expand: true,
                        src: ['<%= config.dist %>/<%= config.temp %>/components/**/*.js', '<%= config.dist %>/<%= config.temp %>/modules/**/*.js'],
                        extDot: 'last'      // Extensions in filenames begin after the last dot
                    }
                ]
            }
        },

        watch: {

            ts: {
                files: [
                    'app/modules/**/*.ts',
                    'app/components/**/*.ts'
                ],
                options: {
                    debounceDelay: 2000
                },
                tasks: [ "ts:watch" ]
            },

            javascript: {
                options: {
                    livereload: true,
                    spawn: false
                },
                files: [
                    'Gruntfile.js',
                    '<%= config.app %>/components/**/*.js',
                    '<%= config.app %>/modules/**/*.js',
                    '<%= config.app %>/*.js',
                    '<%= config.app %>/**/*.json'
                ],
                tasks: ['editor', 'jshint']
            },
            html: {
                options: {
                    livereload: true,
                    spawn: false
                },
                files: [
                    '<%= config.app %>/**/*.html',
                    '<%= config.app %>/components/**/*.html',
                    '<%= config.app %>/modules/**/*.html',
                    '<%= config.app %>/assets/**/*.html'
                ],
                tasks: ['editor']
            },
            styles: {
                options: {
                    livereload: true,
                    spawn: false
                },
                files: [
                    '<%= config.app %>/components/**/*.css',
                    '<%= config.app %>/modules/**/*.css',
                    '<%= config.app %>/styles/**/*.css'
                ],
                tasks: ['editor']
            },
            json: {
                options: {
                    livereload: true,
                    spawn: false
                },
                files: [
                    '<%= config.app %>/assets/**/i18n/*.json',
                    '<%= config.app %>/components/**/i18n/*.json',
                    '<%= config.app %>/modules/**/i18n/*.json'
                ],
                tasks: ['editor']
            },
            image: {
                options: {
                    livereload: true,
                    spawn: false
                },
                files: [
                    '<%= config.app %>/assets/**/*.{png,jpg,jpeg,gif}',
                    '<%= config.app %>/components/**/*.{png,jpg,jpeg,gif}',
                    '<%= config.app %>/modules/**/*.{png,jpg,jpeg,gif}'
                ],
                tasks: ['editor']
            },
            less: {
                options: {
                    livereload: true,
                    spawn: false
                },
                files: [
                    '<%= config.app %>/bower_components/bootstrap/less/bootstrap.less',
                    '<%= config.app %>/less/*.less',
                    '<%= config.app %>/components/**/*.less',
                    '<%= config.app %>/modules/**/*.less'
                ],
                tasks: ['editor']

            }
        },

        less: {
            style: {
                files: [
                    {
                        '<%= config.dist %>/styles/main.css': '<%= config.app %>/less/main.less'
                    }
                ]
            }
        },

        bower: {
            debug: {
                dest: '<%= config.dist %>/bower',
                options: {
                    stripAffix: true,
                    expand:true,
                    packageSpecific: {
                        'angular': {
                            dest: "<%= config.dist %>/bower/1-angular"
                        },

                        'jquery': {
                            dest: "<%= config.dist %>/bower/1-jquery"
                        },

                        'angular-translate': {
                            dest: "<%= config.dist %>/bower/2-angular-translate"
                        },

                        'angular-dynamic-locale': {
                            keepExpandedHierarchy: false
                        },

                        'angular-i18n': {
                            dest: '<%= config.dist %>/assets',
                            files: [
                                'angular-locale_en.js',
                                'angular-locale_en-us.js',

                                'angular-locale_cs.js',
                                'angular-locale_cs-cz.js'
                            ]
                        },

                        'bootswatch-dist': {
                            dest: "<%= config.dist %>/bower",
                            js_dest: '<%= config.dist %>/bower'
                        }
                    }
                }
            },
            release: {
                dest: '<%= config.dist %>/<%= config.temp %>/bower',
                options: {
                    stripAffix: true,
                    expand:true,
                    packageSpecific: {
                        'angular': {
                            dest: "<%= config.dist %>/<%= config.temp %>/bower/1-angular"
                        },

                        'jquery': {
                            dest: "<%= config.dist %>/<%= config.temp %>/bower/1-jquery"
                        },

                        'angular-translate': {
                            dest: "<%= config.dist %>/<%= config.temp %>/bower/2-angular-translate"
                        },

                        'angular-dynamic-locale': {
                            keepExpandedHierarchy: false
                        },

                        'angular-i18n': {
                            dest: '<%= config.dist %>/assets',
                            files: [
                                'angular-locale_en.js',
                                'angular-locale_en-us.js',

                                'angular-locale_cs.js',
                                'angular-locale_cs-cz.js'
                            ]
                        },

                        'bootswatch-dist': {
                            dest: "<%= config.dist %>/bower",
                            js_dest: '<%= config.dist %>/<%= config.temp %>/bower'
                        },

                        'ui-select': {
                            dest: "<%= config.dist %>/bower",
                            js_dest: '<%= config.dist %>/<%= config.temp %>/bower'
                        }
                    }
                }
            }
        },

        copy: {
            debug: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>',
                        src: [
                            '*.html'
                        ]
                    }
                ]
            },

            bower: {
                files: [

                    {expand:true, cwd: '<%= config.app %>', src:['*.js'], dest:'<%= config.dist %>'},

                    {expand:true, cwd: '<%= config.app %>', src:['assets/**/*.*'], dest:'<%= config.dist %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['styles/**/*.css'], dest:'<%= config.dist %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['data/**/*.*'], dest:'<%= config.dist %>'},

                    {expand:true, cwd: '<%= config.app %>', src:['components/**/*.*'], dest:'<%= config.dist %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['modules/**/*.*'], dest:'<%= config.dist %>'}

                ]
            },
            release: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>',
                        src: [
                            'index.html'
                        ]
                    },

                    {expand:true, cwd: '<%= config.app %>', src:['*.js'], dest:'<%= config.dist %>/<%= config.temp %>'},

                    {expand:true, cwd: '<%= config.app %>', src:['assets/**/*.*'], dest:'<%= config.dist %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['styles/**/*.css'], dest:'<%= config.dist %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['data/**/*.*'], dest:'<%= config.dist %>'},

                    {expand:true, cwd: '<%= config.app %>', src:['components/**/*.js'], dest:'<%= config.dist %>/<%= config.temp %>'},
                    {expand:true, cwd: '<%= config.app %>', src:['modules/**/*.js'], dest:'<%= config.dist %>/<%= config.temp %>'}

                ]
            },

            releaseSpecial:{
                files: [

                    {
                        expand:false,
                        src:['<%= concat.dist.dest %>'],
                        dest:'<%= config.dist %>/<%= pkg.name %>.min.js'

                    }
                ]
            }

        },

        ngdocs: {
            options: {
                doc: 'docs',
                title: 'ngCore Docs',
                html5Mode: false
            },

            app: {
                src: ['app/**/*.js', '!app/bower/**/*.js'],
                title: "ngCore"
            }
        },

        includeSource: {
            options: {
                basePath: '<%= config.dist %>',
                baseUrl: '',
                duplicates: false,
                templates: {
                    html: {
                        js: '<script src="{filePath}"></script>',
                        css: '<link rel="stylesheet" type="text/css" href="{filePath}" />'
                    }
                }

            },
            debug: {
                files: {
                    '<%= config.dist %>/index.html': '<%= config.dist %>/index.html'
                },
                ordering: "top-down"
            },
            release: {
                files: {
                    '<%= config.dist %>/index.html': '<%= config.dist %>/index.html'
                },
                ordering: "top-down"
            }
        },

        replace: {
            release: {
                src: ['<%= config.dist %>/*.html'],
                overwrite: true,                 // overwrite matched source files
                replacements: [
                    {
                        from: '<!-- include: "type": "js", "files": "*.js" -->', to: ''
                    },
                    {
                        from: '<!-- include: "type": "js", "files": "js/**/*.js, !*.js" -->', to:''
                    },
                    {
                        from: '<!-- include: "type": "css", "files": "*.css" -->', to:''
                    },
                    {
                        from: '<!-- /include -->', to:''
                    }
                ]
            }
        },

        htmlclean: {
            options: {

            },
            release: {
                src: '<%= config.dist %>/index.html',
                dest: '<%= config.dist %>/index.html'
            }
        },

        protractor: {
            options: {
                configFile: "test/protractor-conf.js", // Default config file
                keepAlive: true, // If false, the grunt process stops when the test fails.
                noColor: false, // If true, protractor will not use colors in its output.
                // debug: true,
                args: {

                }
            },
            e2e: {
                options: {
                    keepAlive: false
                }
            },
            continuous: {
                options: {
                    keepAlive: true
                }
            }
        }

    });


    grunt.registerTask('test-e2e', [
        'clean:dist',
        'ts:development',
        'less',
        'jshint',
        'copy:debug',
        'copy:bower',
        'bower:debug',
        'wrap:default',
        'ngAnnotate',
        'includeSource:debug',
        'connect:server', 'protractor:e2e']);


    grunt.registerTask('docs', function () {
        grunt.task.run([
            'clean:docs',
            'jshint',
            'ngdocs'
        ]);
    });

    grunt.registerTask('editor', function () {
        grunt.task.run([
            //'clean:dist',
            //'ts:development',
            'less',
            'jshint',
            'copy:debug',
            'copy:bower',
            'bower:debug',
            'wrap:default',
            'includeSource:debug'
        ]);
    });

    grunt.registerTask('debug', function () {
        grunt.task.run([
            'clean:dist',
            'ts:development',
            'less',
            'jshint',
            'copy:debug',
            'copy:bower',
            'bower:debug',
            'wrap:default',
            'includeSource:debug',
            'connect:server',
            'watch'
        ]);
    });


    grunt.registerTask('release', function () {
        grunt.task.run([
            'clean:dist',
            'ts:release',
            'less',
            'ngtemplates',
            'jshint',
            'copy:release',
            'bower:release',
            'wrap:release',
            'ngAnnotate:release',
            'concat',
            'uglify',
            //'copy:releaseSpecial',
            'clean:release',
            'connect',
            'includeSource:release',
            'htmlclean',
            'watch'
        ]);
    });
};
