const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const babel = require('gulp-babel');
const browserify = require('gulp-browserify');
const del = require('del');

// PATH VAR
const PUBLIC = './public/'

const COMPRESSED = PUBLIC + 'compressed/'
const DIRECTORIES = {
  sass: PUBLIC + 'sass/',
  js: PUBLIC + 'js/'
}
const SRC = {
  js: [
    DIRECTORIES.js + 'functions.js',
    DIRECTORIES.js + 'vendors/*.js',
    DIRECTORIES.js + 'services/*.js',
    DIRECTORIES.js + 'socket/*.js',
    DIRECTORIES.js + 'three/*.js',
    DIRECTORIES.js + 'controllers/*.js',
    DIRECTORIES.js + 'main.js'
  ],
  sass: [
    DIRECTORIES.sass + 'main.scss'
  ]
}
// TASKS

gulp.task('cleanProd', () => {
    return del(COMPRESSED);
});

gulp.task('wagner', () => {
return gulp.src(PUBLIC + 'app.js')
	.pipe(browserify({insertGlobals : true}))
	.pipe(babel({ presets: ["env"] }))
	.pipe(concat('/wagner.js'))
	.pipe(gulp.dest(PUBLIC + 'js/vendors'))
});

gulp.task('sass', function(){
  return gulp.src(SRC.sass)
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('/main.css'))
        .pipe(gulp.dest(COMPRESSED));
})

gulp.task('js',function() {
  return gulp.src(PUBLIC + 'app.js')
        .pipe(babel({ presets: ["env"] }))
  		.pipe(browserify({insertGlobals : true, paths: ['./node_modules', DIRECTORIES.js]}))
        .pipe(concat('/main.js'))
        .pipe(gulp.dest(COMPRESSED))

})

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
