const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const browserSync = require('browser-sync')
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
        // .pipe(browserSync.reload({ stream: true }))
})

gulp.task('js',function() {
  return gulp.src(DIRECTORIES.js + '**/*.js')
        .pipe(concat('/main.js'))
        .pipe(gulp.dest(COMPRESSED))
        // .pipe(browserSync.reload({ stream: true }))
})

gulp.task('build', function() {
  gulp.task('sass')
  gulp.task('js')
})

// MONITORING

gulp.task('default', ['build','watch','nodemon'] ,function(next){
  // browserSync({
  //   proxy: 'http://localhost:3000',
  //   port: 4000
  // })

  next()
})

gulp.task('nodemon',  function(next) {
  var called = false
  return nodemon({
    script: 'app.js',
    env: { 'NODE_ENV': 'developement' }
  })
  // .on('start', function() {
  //   if (!called) next()
  //   called = true;
  // })
  // .on('restart', function() {
  //   browserSync.reload({
  //     stream: false
  //   })
  // })
})

gulp.task('watch', function(next) {

  gulp.watch(DIRECTORIES.sass + '**/*.scss',['sass'])
  gulp.watch(DIRECTORIES.js + '**/*.js',['js'])
  // gulp.watch('**/*.ejs',[browserSync.reload])

  next()
})
