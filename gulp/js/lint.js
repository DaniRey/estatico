'use strict';

/**
 * @function `gulp js:lint`
 * @desc Lint JavaScript files (using `JSHint`).
 */

var gulp = require('gulp');

var taskName = 'js:lint',
	taskConfig = {
		src: [

			// './gulp/**/*.js',
			// './helpers/**/*.js',
			// './test/**/*.js',
			// '!./test/**/expected/**/*.js',
			'./source/assets/js/**/*.js',
			'./source/modules/**/*.js',
			'./source/pages/**/*.js',
			'./source/demo/modules/**/*.js',
			/*'./source/demo/modules/!**!/!*.jsx',*/
			'./source/demo/pages/**/*.js',
			'!./source/modules/.scaffold/scaffold.js'
		]
	};

gulp.task(taskName, function() {
	var helpers = require('require-dir')('../../helpers'),
		tap = require('gulp-tap'),
		path = require('path'),
		cached = require('gulp-cached'),
		jshint = require('gulp-jshint'),
		jscs = require('gulp-jscs');

	return gulp.src(taskConfig.src, {
		dot: true
	})
		.pipe(cached('linting'))
		.pipe(jshint({ linter: require('jshint-jsx').JSXHINT }))
		.pipe(jscs({
			configPath: '.jscsrc'

			// Automatically fix invalid code (files would have to be saved back to disk below)
			// fix: true
		}))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jscs.reporter())
		.pipe(tap(function(file) {
			if (!file.jshint.success || !file.jscs.success) {
				helpers.errors({
					task: taskName,
					message: 'Linting error in file "' + path.relative('./source/', file.path) + '" (details above)'
				});
			}
		}));
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
