import gulp from 'gulp';

function setEnv(event, value) {
  if (event.task !== 'test') {
    return;
  }

  process.env.BABEL_ENV = value;
}

gulp.on('task_start', e => setEnv(e, 'test'));
gulp.on('task_stop',  e => setEnv(e));
