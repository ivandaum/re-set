import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import gutil from 'gulp-util'
const nodemon = require('gulp-nodemon')
const concat = require('gulp-concat')
const debug = require('gulp-debug')
const sass = require('gulp-sass')
import browserify from 'gulp-browserify'

// PATH VAR
const PUBLIC = './public/'

const COMPRESSED = PUBLIC + 'compressed/'
const DIRECTORIES = {
  sass: PUBLIC + 'sass/',
  js: PUBLIC + 'js/'
}
const SRC = {
  js: [
    DIRECTORIES.js + 'Utils.js',
    DIRECTORIES.js + 'vendors/*.js',
    DIRECTORIES.js + 'services/*.js',
    DIRECTORIES.js + 'socket/*.js',
    DIRECTORIES.js + 'three/*.js',
    DIRECTORIES.js + 'controllers/*.js',
    //DIRECTORIES.js + 'main.js'
  ],
  sass: [
    DIRECTORIES.sass + 'main.scss'
  ]
}
// TASKS

gulp.task('cleanProd', () => {
    return del(COMPRESSED);
});

// gulp.task('wagner', () => {
// return gulp.src(PUBLIC + 'app.js')
// 	.pipe(browserify({insertGlobals : true}))
// 	.pipe(babel({ presets: ["env"] }))
// 	.pipe(concat('/wagner.js'))
// 	.pipe(gulp.dest(PUBLIC + 'js/vendors'))
// });

gulp.task('sass', function(){
  return gulp.src(SRC.sass)
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('/main.css'))
        .pipe(gulp.dest(COMPRESSED));
})

gulp.task('babelify', ['cleanProd'],  () => {
    return gulp.src('./public/js/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest(COMPRESSED))
});


gulp.task('js', ['babelify'],  () => {
  return gulp.src('./public/app.js')
        .pipe(babel())
        .pipe(browserify({
            insertGlobals : true,
            debug : !gutil.env.production,
            paths: ['./node_modules','./public/js'],
            //transform: ['glslify']
        }))
        //.pipe(uglify())
        //.pipe(concat('/main.js'))
        .pipe(gulp.dest(COMPRESSED))
});

// gulp.task('js',function() {
//   return gulp.src(PUBLIC + 'app.js')
//         .pipe(babel())
//   		  .pipe(browserify({insertGlobals : true, paths: ['./node_modules', DIRECTORIES.js]}))
//         .pipe(concat('/main.js'))
//         .pipe(gulp.dest(COMPRESSED))
//
// })

gulp.task('build', ['cleanProd', 'sass','js'])

// MONITORING

gulp.task('default', ['watch','nodemon'] ,function(next){
  next()
})

gulp.task('nodemon',  function(next) {
  var called = false
  return nodemon({
    script: 'app.js',
    env: { 'NODE_ENV': 'developement' }
  })
  .on('start', function() {
    if (!called) next()
    called = true;
  })
})

gulp.task('watch', function(next) {
  gulp.watch(DIRECTORIES.sass + '**/*.scss',['sass'])
  gulp.watch(DIRECTORIES.js + '**/*.js',['js'])

  next()
})
