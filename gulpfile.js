const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const concat = require('gulp-concat')
const sass = require('gulp-sass')

// PATH VAR

const PUBLIC = './public/'
const COMPRESSED = PUBLIC + 'compressed/'
const DIRECTORIES = {
  sass: PUBLIC + 'sass/',
  js: PUBLIC + 'js/'
}

// TASKS

gulp.task('sass', function(){
  return gulp.src(DIRECTORIES.sass + 'main.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('/main.css'))
        .pipe(gulp.dest(COMPRESSED))
})

gulp.task('js',function() {
  return gulp.src(DIRECTORIES.js + '**/*.js')
        .pipe(concat('/main.js'))
        .pipe(gulp.dest(COMPRESSED))
})

gulp.task('build', function() {
  gulp.task('sass')
  gulp.task('js')
})

// MONITORING

gulp.task('default', ['watch'], function(){
  return nodemon({
    script: 'app.js',
    env: { 'NODE_ENV': 'development' }
  })
  .on('restart', function () {
    // restarted
  })
  .on('crash', function(error) {
    console.log('[Daaaamn] SERVER CRASHED : ' + error);
  })
})

gulp.task('watch', function() {
  gulp.task('build')
  gulp.watch(DIRECTORIES.sass + '**/*.scss',['sass'])
  gulp.watch(DIRECTORIES.js + '**/*.js',['js'])
})
