import gulp     from 'gulp';
import ts       from 'gulp-typescript';
import ignore   from 'gulp-ignore';
import rename   from 'gulp-rename';
import merge    from 'merge2';
import babel    from 'gulp-babel';
import del      from 'del';
import jasmine  from 'gulp-jasmine';
import typedoc  from 'gulp-typedoc';
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
    config.paths.temp,
    config.paths.dist,
    config.paths.coverage,
    config.paths.docs
  ], { force: true });
});

function test() {
  return gulp.src(`${config.paths.temp}/${config.paths.spec}/**/*.js`)
    .pipe(jasmine());
}
gulp.task(test);

/**
gulp.task('style', () => {
  return gulp.src(`${config.paths.src}\/**\/*.js`)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});
**/

gulp.task('docs', () => {
  var sources = [
    config.paths.src,
    './typings/index.d.ts'
  ];

  var options = {
    excludeNotExported: true,
    tsconfig: `${__dirname}/tsconfig.json`,
    mode:     'modules',
    out:      config.paths.docs
  };

  return gulp.src(sources)
    .pipe(typedoc(options));
});

var tsProject = ts.createProject('tsconfig.json', {
  declaration: true
});
gulp.task('compile:ts', () => {
  var sources = [
    config.paths.src,
    'typings/main.d.ts'
  ];

  var compile = tsProject.src(sources)
    .pipe(ts(tsProject));

  var js = compile.js
    .pipe(gulp.dest(config.paths.temp));

  var dts = compile.dts
    .pipe(ignore.exclude('spec/**'))
    .pipe(rename(path => {
      path.dirname = path.dirname.replace('src', './');
    }))
    .pipe(gulp.dest(config.paths.dist));

  return merge([js, dts]);
});

gulp.task('compile:es6', () => {
  return gulp.src(`${config.paths.temp}/${config.paths.src}/**/*.js`)
    .pipe(babel())
    .pipe(gulp.dest(config.paths.dist));
});

gulp.task('build',   gulp.series('clean', /*'style',*/ 'compile:ts', 'test', 'compile:es6', 'docs'));
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
