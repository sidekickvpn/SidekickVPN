'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', () =>
  gulp
    .src('app/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css'))
);

gulp.task('sass:watch', () => {
  gulp.watch('app/scss/*.scss', gulp.series('sass'));
});
