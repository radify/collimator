import gulp from 'gulp';

function setEnv(event, set) {
  if (event.name !== 'test' && event.name !== 'coverage') {
    return;
  }

  if (set) {
    process.env.BABEL_ENV = 'test';
    process.env.TRACING_DISABLE = true;
  } else {
    delete process.env.BABEL_ENV;
    delete process.env.TRACING_DISABLE;
  }
}

gulp.on('start', e => setEnv(e, true));
gulp.on('stop',  e => setEnv(e));
