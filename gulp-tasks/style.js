import gulp    from 'gulp';
import jshint  from 'gulp-jshint';
import jscs    from 'gulp-jscs';
import {build} from '../package.json';

gulp.task('jshint', () => {
  return gulp.src(build.paths.src)
    .pipe(jshint());
});

gulp.task('jscs', () => {
  return gulp.src(build.paths.src)
    .pipe(jscs());
});

gulp.task('style', ['jshint', 'jscs']);
