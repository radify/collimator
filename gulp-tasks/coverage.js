import {Instrumenter as isparta} from 'isparta';
import istanbul from 'gulp-istanbul';
import jasmine  from 'gulp-jasmine';
import gulp     from 'gulp';
import {build}  from '../package.json';

gulp.task('istanbul', () => {
  return gulp.src(build.paths.src)
    .pipe(istanbul({
      instrumenter: isparta
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('coverage', ['istanbul', 'test'], () => {
  return gulp.src(build.paths.src)
    .pipe(istanbul.writeReports({
      dir: build.paths.coverage,
      reporters: ['html', 'text']
    }));
});
