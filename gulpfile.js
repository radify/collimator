var gulp     = require('gulp');
var istanbul = require('gulp-istanbul');
var jasmine  = require('gulp-jasmine');
var jscs     = require('gulp-jscs');
var markdox  = require('gulp-markdox');
var concat   = require('gulp-concat');
var jshint   = require('gulp-jshint');

var src  = './src/**/*.js';
var spec = './spec/**/*.js';

gulp.task('lint', function() {
  return gulp.src(src)
    .pipe(jshint());
});

gulp.task('test', function() {
  return gulp.src(spec)
      .pipe(jasmine());
});

gulp.task('coverage', function() {
  return gulp.src(src)
      .pipe(istanbul())
      .pipe(istanbul.hookRequire())
      .on('finish', function() {
        gulp.src(spec)
          .pipe(jasmine())
          .pipe(istanbul.writeReports({
            dir: './build/coverage',
            reporters: ['html', 'text']
          }));
      });
});

gulp.task('style', function() {
  return gulp.src(src)
    .pipe(jscs());
});

gulp.task('docs', function() {
  return gulp.src(src)
    .pipe(markdox())
    .pipe(concat('api.md'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['lint', 'style', 'test', 'docs']);

gulp.task('dev', function() {
  gulp.watch([src, spec], ['default']);
});
