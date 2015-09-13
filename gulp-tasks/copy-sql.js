import gulp    from 'gulp';
import {build} from '../package.json';

gulp.on('task_stop', event => {
  if (event.task !== 'dist') {
    return;
  }

  return gulp.src(build.paths.sql)
    .pipe(gulp.dest(build.paths.dist));
});
