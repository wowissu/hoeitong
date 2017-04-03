'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('scss', function () {
  return gulp.src('./css/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('default', function () {
  gulp.watch('./css/scss/**/*.scss', ['scss']);
});