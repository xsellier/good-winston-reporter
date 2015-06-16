'use strict';

var gulp   = require('gulp');
var lab    = require('gulp-lab');
var jshint = require('gulp-jshint');

gulp.task('test', function() {
  process.env.NODE_ENV = 'test';

  gulp.src([ './test/*.test.js'])
  .pipe(lab('-l -v -C --debug'));
});

gulp.task('lint', function() {
  gulp.src(['./lib/**/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('dev', function() {
  require('./lib/index.js');
});

gulp.task('watch', function() {
  gulp.watch('test/**/*.js', ['lint', 'test']);
  gulp.watch('lib/**/*.js', ['lint', 'test']);
});

gulp.task('default', ['dev']);