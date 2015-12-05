'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('eslint', function () {
	return gulp.src(['js/**/*.js','!js/lib/**', '!node_modules/**', '!bower_components/**'])
		.pipe(eslint({
			extends: 'xo/browser',
			envs: [
				'browser',
				'jquery'
			]
		}))
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('lint', ['eslint']);
