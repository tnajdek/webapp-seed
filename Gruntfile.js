module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		requirejs: {
			compile: {
				options: {
					name: "../../node_modules/almond/almond",
					baseUrl: "src/js",
					mainConfigFile: "src/js/require-config.js",
					out: "build/js/webapp.js",
					optimize: 'none', // neet to remove console.log before minification
					include: ['bootstrap'],
					insertRequire: ['bootstrap'],
					stubModules: ['text'],
					preserveLicenseComments: false,
					wrap: {
						start: "(function(){",
						end: "}());"
					}
				}
			}
		},
		removelogging: {
			dist: {
				src: "build/js/webapp.js",
				dest: "build/js/webapp.js",
			},
		},
		uglify: {
			archers: {
				files: {
				'build/js/webapp.js': ["build/js/webapp.js"]
				}
			}
		},
		less: {
			development: {
				options: {
					compress: false,
					yuicompress: false,
					// dumpLineNumbers: 'all'
				},
				files: {
					"local/css/webapp.css": "src/less/webapp.less"
				}
			},
			production: {
				options: {
					optimization: 0,
					compress: true,
					yuicompress: true
				},
				files: {
					"build/css/webapp.css": "src/less/webapp.less"
				}
			}
		},
		replace: {
			index: {
				src: 'src/index.html',
				dest: 'build/index.html',
				replacements: [{
					from: '<script data-main="/js/require-config" src="/bower_components/requirejs/require.js"></script>',
					to: '<script src="/js/webapp.js?cb=<%= Date.now() %>"></script>'
				}]
			}
		},
		connect: {
			server: {
				options: {
					port: 8080,
					base: 'local'
				}
			}
		},
		watch: {
			less: {
				files: ['src/less/*.less', 'src/less/**/*.less'],
				tasks: ['less:development', 'autoprefixer:css'],
				options: {
					spawn: false,
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 2 version']
			},
			css: {
				src: 'build/css/webapp.css',
				dest: 'build/css/webapp.css'
			}
		},
		cssmin: {
			minify: {
				files: {
					'build/css/webapp.css': ['build/css/webapp.css']
				}
			}
		},
		symlink: {
			local: {
				files: [{
					expand: true,
					cwd: 'src',
					src: ['index.html', 'img', 'js'],
					dest: 'local'
				}]
			}
		},
		karma: {
			build: {
				options: {
					basePath: 'src',
					frameworks: ['jasmine', 'requirejs'],
					files: ['test/**/*.js'],
					exclude: 'src/require-config.js'
				},
				singleRun: true,
				browsers: ['Firefox']
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-remove-logging');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-symlink');
	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('build', ['requirejs', 'removelogging', 'uglify', 'replace:index', 'less:production']);
	grunt.registerTask('default', ['symlink:local', 'less:development', 'connect', 'watch:less']);
};