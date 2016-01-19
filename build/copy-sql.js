import gulp    from 'gulp';
import {build} from '../package.json';

gulp.on('stop', e => {
  if (e.name !== 'compile') {
    return;
  }

  return gulp.src(build.paths.sql)
    .pipe(gulp.dest(build.paths.dist));
});
