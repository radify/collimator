import gulp    from 'gulp';
import markdox from 'gulp-markdox';
import concat  from 'gulp-concat';
import {build} from '../package.json';

gulp.task('docs', () => {
  return gulp.src(build.paths.src)
    .pipe(markdox())
    .pipe(concat('api.md'))
    .pipe(gulp.dest('.'));
});
