const gulp = require('gulp'),
      plugins = require('gulp-load-plugins')({rename: {'gulp-util': 'gutil', 'gulp-cached': 'cache', 'gulp-6to5': 'to5'}});

const {
  sequence,
  gutil,
  cache,
  print,
  watch,
  sourcemaps,
  to5,
  traceur,
  concat,
  jshint,
  clean,
  pipe
} = plugins;

gulp.task('default', ['build']);

gulp.task('build', sequence('clean', 'transpile'));

gulp.task('dev', () => gulp.watch(paths.scripts, ['runtime']));

console.log(traceur.RUNTIME_PATH);
gulp.task('transpile', //['jshint'],
  () => pipe([
    gulp.src(paths.scripts)
    ,cache('transpile')
    ,print()
    ,sourcemaps.init()
    // ,to5()
    ,traceur({modules: 'commonjs', asyncGenerators: true, forOn: true, asyncFunctions: true})
    ,sourcemaps.write('.')
    ,gulp.dest(paths.dist)
  ])
  .on('error', function(e) { console.log(e); }));

gulp.task('runtime', ['transpile'],
  () => pipe([
    gulp.src([traceur.RUNTIME_PATH])
    ,print()
    ,concat('traceur-runtime.js')
    ,gulp.dest(paths.dist)
  ])
  .on('error', function(e) { console.log(e); }));

gulp.task('jshint',
  () => pipe([
    gulp.src(paths.scripts)
    ,cache('jshint')
    ,print()
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
