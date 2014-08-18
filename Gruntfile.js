'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		conf: {
			fingerprint: new Date().getTime(),
			distDir : 'dist'
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

		htmlmin: {
			app: {
				files: {
					'<%= conf.distDir %>/index.html': 'index.html'
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
						{ match: /\.\.\/bower_components\/requirejs\/require/g, replacement: 'scripts/<%= conf.fingerprint %>_require', expression: false }
					],
					prefix: ''
				},
				files: {
					'<%= conf.distDirV1 %>/index.html': '<%= conf.distDir %>/index.html'
				}
			}
		},

		compress: {
			deliver: {
				options: {
					archive: 'livrables/<%= conf.archiveName %>.tgz',
					mode: 'tgz'
				},
				expand: true,
				src: ["**/*"],
				cwd: "dist/"
			}
		},

		watch: {
			html: {
				files: ['**/*.html']
			},
			options: {
				livereload: true
			}
		},

		connect: {
			dev : {
				options: {
					port: 9000,
					base: '.'
				}
			},
			dist: {
				options: {
					keepalive: true,
					port: 9005,
					base: 'dist'
				}
			}
		}
	});

	grunt.registerTask('build', function(target){

		var tasks = [
			'clean',
			'requirejs',
			'htmlmin',
			'uglify',
			'copy',
			'usemin',
			'replace'
		];

		grunt.task.run(tasks);
	});

	grunt.registerTask('serve', function(target){

		if(target === "dist") {
			grunt.task.run(['build', 'connect:dist']);
		} else {
			grunt.task.run(['connect:dev', 'watch']);
		}
	});

	grunt.registerTask('deliver', ['build', 'compress']);

};