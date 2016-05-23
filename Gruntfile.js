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
        app: 'src', //application source code folder
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
                        src: ['<%= config.dist %>/**/*.js'],
                        extDot: 'last'      // Extensions in filenames begin after the last dot
                    }
                ]
            },
            release: {
                files: [
                    {
                        expand: true,
                        src: ['<%= config.dist %>/<%= config.temp %>/**/*.js'],
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
                        '<%= config.dist %>/styles/main.css': '<%= config.app %>/main.less'
                    }
                ]
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
        }

    });




    grunt.registerTask('docs', function () {
        grunt.task.run([
            'clean:docs',
            'jshint',
            'ngdocs'
        ]);
    });

    grunt.registerTask('build', function () {
        grunt.task.run([
            'clean:dist',
            'ts:release',
            'less',
            'ngtemplates',
            'jshint',
            'copy:release',
            'wrap:release',
            'ngAnnotate:release',
            'concat',
            //'uglify',
            //'clean:release'
        ]);
    });
};
