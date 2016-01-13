import gulp     from 'gulp';
import babel    from 'gulp-babel';
import del      from 'del';
import jasmine  from 'gulp-jasmine';
import markdox  from 'gulp-markdox2';
import jscs     from 'gulp-jscs';
import istanbul from 'gulp-istanbul';
import reqDir   from 'require-dir';

import {
  build as config
} from './package.json';

import {
  Instrumenter as isparta
} from 'isparta';

gulp.task('clean', () => {
  return del([
    config.paths.dist,
    config.paths.coverage,
    config.paths.docs
  ], { force: true });
});

function test() {
  return gulp.src(`${config.paths.spec}/**/*.js`)
    .pipe(jasmine());
}
gulp.task(test);

gulp.task('style', () => {
  return gulp.src(`${config.paths.src}/**/*.js`)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('docs', () => {
  return gulp.src(`${config.paths.src}/**/*.js`)
    .pipe(markdox({concat: 'API.md'}))
    .pipe(gulp.dest(config.paths.docs));
});

gulp.task('compile', () => {
  return gulp.src(`${config.paths.src}/**/*.js`)
    .pipe(babel())
    .pipe(gulp.dest(config.paths.dist));
});

gulp.task('build',   gulp.series('clean', 'style', 'test', 'compile', 'docs'));
gulp.task('default', gulp.task('build'));

gulp.task('watch', () => {
  return gulp.watch([config.paths.src, config.paths.spec], gulp.task('build'));
});

const coverage = {
  setup() {
    return gulp.src(`${config.paths.src}/**/*.js`)
      .pipe(istanbul({
        instrumenter:    isparta,
        includeUntested: true
      }))
      .pipe(istanbul.hookRequire());
  },

  run() {
    return test()
      .pipe(istanbul.writeReports({
        reporters:  ['lcov', 'text'],
        reportOpts: { dir: config.paths.coverage }
      }));
  }
};
gulp.task('coverage', gulp.series(coverage.setup, coverage.run));

try {
  reqDir(config.paths.build);
} catch(err) {}
