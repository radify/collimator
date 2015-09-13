import gulp   from 'gulp';
import gif    from 'gulp-if';
import smaps  from 'gulp-sourcemaps';
import babel  from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import jas    from 'gulp-jasmine';
import yargs  from 'yargs';
import reqDir from 'require-dir';
import config from './package.json';

const args = yargs.argv;

const conf = (name, override) => Object.assign(({
  test: { src:  config.build.paths.spec, pipe: jas({ includeStackTrace: true }) },
  dist: { dest: config.build.paths.dist, smaps: true },
  min:  { dest: config.build.paths.dist, file: `${config.name}.min.js`, min: true, smaps: false }
})[name], override || {});

const pipeline = opts => [gulp.src(opts.src || config.build.paths.src)].concat(opts.pipe || [
  gif(!!opts.smaps,   smaps.init()),
  gif(!!opts.modules, babel({ modules: opts.modules })),
  gif(!!opts.file,    concat(opts.file || `${config.build.name}.js`)),
  gif(!!opts.min,     uglify()),
  gif(!!opts.smaps,   smaps.write('.')),
  gulp.dest(opts.dest)
]);
const chain = steps => steps.reduce((prev, step) => prev && prev.pipe(step) || step);
const build = (name, opts) => chain(pipeline(conf(name, opts)));
const bind  = (fn, ...args) => () => fn(...args);

gulp.task('test',    bind(build, 'test'));
gulp.task('dist',    bind(build, args.min ? 'min' : 'dist', Object.assign({ modules: 'common' }, args)));
gulp.task('watch',   gulp.watch.bind(gulp, config.build.watch.paths, config.build.watch.tasks));
gulp.task('default', ['test', 'dist']);

if (config.build.tasks) {
  reqDir(config.build.tasks);
}

gulp.on('err', e => console.log("Gulp error:", e.err.stack));
