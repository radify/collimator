import seq  from 'run-sequence';
import gulp from 'gulp';

gulp.task('default', done => seq('test', ['dist', 'docs'], done));
