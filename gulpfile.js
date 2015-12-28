'use strict';

var gulp = require('gulp');
var htmlhint = require('gulp-htmlhint');
var eslint = require('gulp-eslint');
var csslint = require('gulp-csslint');

gulp.task('htmlhint', function() {
	return gulp.src(['src/index.html'])
		.pipe(htmlhint({
			// https://github.com/yaniswang/HTMLHint/wiki/Rules
			// Standard
			'tagname-lowercase': true,
			'attr-lowercase': true,
			'attr-value-double-quotes': true,
			'attr-value-not-empty': true,
			'attr-no-duplication': true,
			'doctype-first': true,
			'tag-pair': true,
			'tag-self-close': true,
			'spec-char-escape': true,
			'id-unique': true,
			'src-not-empty': true,
			'title-require': true,
			// Performance
			'head-script-disabled': false,
			// Accessibility
			'alt-require': false,
			// Specification
			'doctype-html5': true,
			'id-class-value': 'dash',
			'style-disabled': true,
			'inline-style-disabled': true,
			'inline-script-disabled': true,
			'space-tab-mixed-disabled': 'tab',
			'id-class-ad-disabled': true,
			'href-abs-or-rel': false,
			'attr-unsafe-chars': true
		}))
		.pipe(htmlhint.reporter())
		.pipe(htmlhint.reporter('fail'));
});

gulp.task('csslint', function () {
	return gulp.src(['src/css/**/*.css'])
		.pipe(csslint({
			'adjoining-classes': false,
			// FIXME: 警告が多すぎるため、一旦無視
			'fallback-colors': false,
			'qualified-headings': false,
			'unique-headings': false
		}))
		.pipe(csslint.reporter())
		.pipe(csslint.reporter('fail'));
});

gulp.task('eslint', function () {
	return gulp.src(['src/js/**/*.js'])
		.pipe(eslint({
			extends: 'xo/browser',
			envs: [
				'browser',
				'jquery'
			],
			globals: {
				'$$': true
			},
			rules: {
				'new-cap': [2, {'capIsNewExceptions': ['$.Deferred']}],
				'quote-props': [2, 'as-needed', { 'keywords': true, 'unnecessary': false }],
				'no-unused-expressions': [2, { allowShortCircuit: true, allowTernary: true }],
				'operator-linebreak': [2, 'before', {'overrides': {'=': 'after'}}]
			}
		}))
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('lint', ['htmlhint', 'csslint', 'eslint']);
