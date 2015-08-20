var gulp     = require('gulp');
var plumber  = require('gulp-plumber');
var istanbul = require('gulp-istanbul');
var jasmine  = require('gulp-jasmine');
var jscs     = require('gulp-jscs');

var src  = './src/**/*.js';
var spec = './spec/**/*.js';

gulp.task('test', function(done) {
  gulp.src(src)
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(spec)
        .pipe(jasmine())
        .pipe(istanbul.writeReports({
          dir: './dist/coverage',
          reporters: ['html', 'text']
        }))
        .on('end', done);
    });
});

gulp.task('style', function(done) {
  return gulp.src(src)
    .pipe(jscs({
      preset: 'google'
    }));
});

gulp.task('default', ['style', 'test']);

gulp.task('dev', ['default'], function() {
  gulp.watch([src, spec], ['default']);
});
