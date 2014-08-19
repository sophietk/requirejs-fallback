(function () {
    'use strict';

    module.exports = function (grunt) {
        require('load-grunt-tasks')(grunt);

        grunt.initConfig({

            pkg: grunt.file.readJSON('package.json'),

            conf: {
                fingerprint: new Date().getTime(),
                distDir: 'dist',
                archiveName: '<%= pkg.name %>-<%= pkg.version %>'
            },

            jshint: {
                app: ['Gruntfile.js', 'js/**/*.js']
            },

            clean: {
                dist: ['<%= conf.distDir %>/*']
            },

            requirejs: {
                app: {
                    options: {
                        baseUrl: 'js',
                        optimize: 'none',
                        preserveLicenseComments: false,
                        useStrict: true,
                        wrapShim: true,
                        name: 'main',
                        out: '<%= conf.distDir %>/scripts/<%= conf.fingerprint %>_main-built.js',
                        mainConfigFile: 'js/main.js'
                    }
                }
            },

            uglify: {
                app: {
                    files: {
                        '<%= conf.distDir %>/scripts/<%= conf.fingerprint %>_main-built.js': '<%= conf.distDir %>/scripts/<%= conf.fingerprint %>_main-built.js',
                        '<%= conf.distDir %>/scripts/<%= conf.fingerprint %>_require.js': 'bower_components/requirejs/require.js'
                    }
                }
            },

            copy: {
                libFallback : {
                    src: 'js/package/libFallback.js',
                    dest: '<%= conf.distDir %>/scripts/package/libFallback.js'
                }
            },

            htmlmin: {
                app: {
                    files: {
                        '<%= conf.distDir %>/index.html': 'index.html'
                    }
                }
            },

            cssmin: {
                app: {
                    options: {
                        compatibility: 'ie8'
                    },
                    files: {
                        '<%= conf.distDir %>/styles/<%= conf.fingerprint %>_main.css': [
                            'css/app.css'
                        ]
                    }
                }
            },

            usemin: {
                html: ['<%= conf.distDir %>/{,*/}*.html'],
                css: ['<%= conf.distDir %>/styles/{,*/}*.css'],
                options: {
                    dirs: ['<%= conf.distDir %>']
                }
            },

            replace: {
                app: {
                    options: {
                        patterns: [
                            { match: /scripts\/main-built/g, replacement: 'scripts/<%= conf.fingerprint %>_main-built', expression: false },
                            { match: /styles\/main/g, replacement: 'styles/<%= conf.fingerprint %>_main', expression: false },
                            { match: /bower_components\/requirejs\/require/g, replacement: 'scripts/<%= conf.fingerprint %>_require', expression: false },
                            { match: /dev version/g, replacement: 'minified version', expression: false }
                        ],
                        prefix: ''
                    },
                    files: {
                        '<%= conf.distDir %>/index.html': '<%= conf.distDir %>/index.html'
                    }
                }
            },

            compress: {
                deliver: {
                    options: {
                        archive: 'delivery/<%= conf.archiveName %>.tgz',
                        mode: 'tgz'
                    },
                    expand: true,
                    src: ['**/*'],
                    cwd: '<%= conf.distDir %>/'
                }
            },

            watch: {
                html: {
                    files: ['**/*.html']
                },
                scripts: {
                    files: ['js/**/*.js'],
                    tasks: ['jshint'],
                    options: {
                        spawn: false
                    }
                },
                options: {
                    livereload: true
                }
            },

            connect: {
                dev: {
                    options: {
                        port: 7000,
                        base: '.'
                    }
                },
                dist: {
                    options: {
                        keepalive: true,
                        port: 7001,
                        base: '<%= conf.distDir %>'
                    }
                }
            }
        });

        grunt.registerTask('build', function () {

            var tasks = [
                'clean',
                'requirejs',
                'htmlmin',
                'cssmin',
                'uglify',
                'copy',
                'usemin',
                'replace'
            ];

            grunt.task.run(tasks);
        });

        grunt.registerTask('serve', function (target) {

            if (target === 'dist') {
                grunt.task.run(['build', 'connect:dist']);
            } else {
                grunt.task.run(['connect:dev', 'watch']);
            }
        });

        grunt.registerTask('deliver', ['build', 'compress']);

    };
}());