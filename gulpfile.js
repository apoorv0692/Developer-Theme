var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');

var scssInput = 'app/scss/**/*.scss';

// Compile Sass to Css
gulp.task('sass', function () {
  return gulp.src(scssInput)
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// run local server & start watching for changes
gulp.task('watch', ['sass'], function () {
  gulp.watch(scssInput, ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// start local server
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

// optimize CSS/JS and copy to dist folder
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// clean the dist fodler
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

// build
gulp.task('build', function (callback) {
  runSequence('clean:dist', 'sass', 'useref', callback)
});

// default task
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
});
