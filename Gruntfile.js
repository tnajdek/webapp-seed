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
					dumpLineNumbers: 'all'
				},
				files: {
					"build/css/webapp.css": "src/less/webapp.less"
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
		watch: {
			less: {
				files: ['src/less/*.less', 'src/less/**/*.less'],
				tasks: ['less:development'],
				options: {
					spawn: false,
				}
			}
		},
	});


	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-remove-logging');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('build', ['requirejs', 'removelogging', 'uglify', 'less:production']);
	grunt.registerTask('develop', ['less:development', 'watch:less']);
};