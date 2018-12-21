const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const bro = require('gulp-bro');
const babelify = require('babelify');
// const livereload = require('gulp-livereload');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const docsJsSrc = ['website/static/js/src/**/*.js'];
const packageJsSrc = ['src/**/*.js'];
const dataSrc = ['website/static/data/**/*.json', 'website/static/data/**/*.js'];

const docsSassSrc = ['website/static/css/src/**/*.scss'];
const docsCssDest = 'website/static/css';

gulp.task('default', ['browserify', 'sass', 'watch:js', 'watch:sass']);
gulp.task('build', ['browserify', 'sass']);

gulp.task('browserify', () => {
  return gulp.src(docsJsSrc.concat(['!website/static/js/src/import/**/*.js']))
    .pipe(bro({
      transform: [
        babelify.configure({
          presets: ['@babel/preset-env', '@babel/preset-react']
        })
        // [ 'uglifyify', { global: true } ]
      ]
    }))

    // TODO: config var for dest
    .pipe(gulp.dest('website/static/js/dest'));
});

gulp.task('sass', () => {
  return gulp.src(docsSassSrc)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(docsCssDest))
    // FIXME: vulnerability
    // .pipe(livereload());
});

// gulp.task('transpileJs', () =>
//   gulp.src(docsJsSrc)
//     .pipe(sourcemaps.init())
//     .pipe(babel({
//       presets: ['@babel/env']
//     }))
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest('website/static/js/dest'))
// FIXME: vulnerability
// //     // .pipe(livereload());
// );

// Remove coverage, website/static/**/dest/*
gulp.task('clean', () => {
  console.log('TODO:...clean');
});

// Remove node_modules
gulp.task('uninstall', () => {
  console.log('TODO:...uninstall');
});


gulp.task('watch:js', () => {
  // livereload.listen();
  return gulp.watch([docsJsSrc, packageJsSrc, dataSrc], ['browserify']);
});

gulp.task('watch:sass', () => {
  // FIXME: vulnerability
  // livereload.listen();
  return gulp.watch([docsSassSrc], ['sass']);
});
