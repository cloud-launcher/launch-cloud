const gulp = require('gulp'),
      sourcemaps = require('gulp-sourcemaps'),
      to5 = require('gulp-6to5'),
      clean = require('gulp-clean'),
      concat = require('gulp-concat');

const paths = {
  scripts: ['src/**/*.js'],
  dist: 'dist'
};


gulp.task('default', function() {
  return gulp.src(paths.scripts)
             .pipe(sourcemaps.init())
             .pipe(to5())
             .pipe(concat('index.js'))
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  return gulp.src(paths.dist, {read: false})
             .pipe(clean());
});