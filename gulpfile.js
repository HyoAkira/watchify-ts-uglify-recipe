import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import { exec } from 'child_process';
import { watch, task, series, dest } from 'gulp';
import browserify from 'browserify';
import watchify from 'watchify';
import tsify from 'tsify';
// @ts-ignore
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

function compile() {
  const bundler = browserify({
    basedir: '.',
    debug: true,
    entries: ['./main.ts'],
    cache: {},
    packageCache: {}
  })
  .plugin(tsify)
  .plugin(watchify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(uglify())
  .pipe(dest('dist'));
  function bundle() {
    return bundler
      
  }

  bundler.on('update', bundle);
  return bundle();
}

function watchFiles() {
  watch('*.ts', series(compile));
}

task('compile', compile);
task('watch', watchFiles);
task('default', series('compile', 'watch'));
