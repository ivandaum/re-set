const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const concat = require('gulp-concat')
const sass = require('gulp-sass')

// PATH VAR

const PUBLIC = './public/'
const COMPRESSED = PUBLIC + 'compressed/'
const FILES = {
  sass: PUBLIC + 'sass/'
}

// TASKS

gulp.task('sass', function(){
  return gulp.src(FILES.sass + 'main.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('/main.css'))
        .pipe(gulp.dest(COMPRESSED))
})

// MONITORING

gulp.task('default', ['watch'], function(){
  return nodemon({
    script: 'app.js',
    env: { 'NODE_ENV': 'development' },
    // watch: [FILES.sass + '**/main.scss'],
    tasks: ['build']
  })
  .on('restart', function () {
    // restarted
  })
  .on('crash', function(error) {
    // crashed
  })
})

gulp.task('watch', function() {
  gulp.watch(FILES.sass + '**/*.scss',['sass'])
})
