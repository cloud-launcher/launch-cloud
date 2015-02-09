const gulp = require('gulp'),
      plugins = require('gulp-load-plugins')({rename: {'gulp-6to5': 'to5'}});

const {
  watch,
  sourcemaps,
  to5,
  jshint,
  clean,
  concat,
  pipe
} = plugins;

gulp.task('default', ['transpile']);

gulp.task('dev', () => gulp.watch(paths.scripts, ['jshint']));

gulp.task('transpile', ['clean', 'jshint'],
  () => pipe([
    gulp.src(paths.scripts)
    ,sourcemaps.init()
    ,to5()
    ,sourcemaps.write('.')
    ,gulp.dest(paths.dist)
  ])
  .on('error', function(e) { console.log(e); }));

gulp.task('jshint',
  () => pipe([
    gulp.src(paths.scripts)
    ,jshint()
    ,jshint.reporter('jshint-stylish')
    ,jshint.reporter('fail')
  ]));

gulp.task('clean',
  () => pipe([
    gulp.src(paths.dist, {read: false})
    ,clean()
  ]));

const paths = {
  scripts: ['src/**/*.js'],
  dist: 'dist'
};
