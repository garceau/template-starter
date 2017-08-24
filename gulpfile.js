"use strict";
// Load Em Up
var gulp = require('gulp');
const chalk = require('chalk');
var panini = require('panini');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var sketch = require('gulp-sketch');

// SERVE
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "dist"
    });
});

// IMAGES
gulp.task('images', function(){
  return gulp.src('src/assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/assets/img'))
});

// FONTS
gulp.task('fonts', function() {
  return gulp.src('src/assets/fonts/**/*')
  .pipe(gulp.dest('dist/assets/fonts'))
})

// SCRIPTS:MAIN
gulp.task('scripts:main', function() {
  return gulp.src('src/assets/js/**/*')
  .pipe(gulp.dest('dist/assets/js'))
})

// SCRIPTS:VENDOR
gulp.task('scripts:vendor', function() {
  return gulp.src('src/assets/js/vendor/**/*')
  .pipe(gulp.dest('dist/assets/js/vendor/'))
})

// STYLES:VENDOR
gulp.task('styles:vendor', function() {
  return gulp.src('`src/assets/css/vendor/**/*')
  .pipe(gulp.dest('dist/assets/css/vendor/'))
})

// SASS
gulp.task('sass', function () {
  return gulp.src('./src/assets/scss/**/*.scss')
    .pipe(sass({ 'outputStyle': 'compact'}))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// PANINI
gulp.task('panini', function() {
  gulp.src('./src/pages/**/*.html')
    .pipe(panini({
      root: './src/pages/',
      layouts: './src/layouts/',
      partials: './src/partials/',
      helpers: './src/helpers/',
      data: './src/data/'
    }))
    .pipe(gulp.dest('dist'));
});

// CLEAN: DIST
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

// CLEAN: JS
gulp.task('clean:js', function() {
  return del.sync('dist/*.js');
})

// WATCH FOR CHANGES
gulp.task('watch', function() {
  gulp.watch(['src/{pages,layouts,partials,helpers,data}/**/*'], ['panini', panini.refresh]);
  gulp.watch('src/assets/scss/**/*.scss', ['sass']);
  gulp.watch('dist/**/*.html').on('change', browserSync.reload);
  gulp.watch('src/assets/js/**/*.js', function() {runSequence('clean:js','scripts:main', 'scripts:vendor')});
  gulp.watch('src/assets/fonts/**/*', ['fonts']);
  gulp.watch('src/assets/css/**/*', ['styles:vendor']);
  gulp.watch('src/assets/img/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
});

// DEFAULT TASK
gulp.task('default', function(cb) {
  runSequence(['clean:dist'], ['scripts:main', 'scripts:vendor','styles:vendor'], ['panini', 'sass', 'images', 'fonts', 'sketch'], 'serve', 'watch', cb);
});

// BUILD TASK
gulp.task('build', function(cb) {
  runSequence(['clean:dist', 'clean:data'], ['scripts:main', 'styles:vendor', 'scripts:vendor'], ['panini', 'sass', 'images', 'fonts', 'sketch'], cb);
});

// SKETCH:  SLICES TO PNG
gulp.task('sketch', function () {
    return gulp.src('src/assets/design/*.sketch')
        .pipe(sketch({
            export: 'slices',
            formats: 'png'
        }))
        .pipe(gulp.dest('dist/assets/img/'));
 
});
