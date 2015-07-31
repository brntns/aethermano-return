var gulp = require('gulp')
  , assign = require('lodash.assign')
  , gutil = require('gulp-util')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , minifycss = require('gulp-minify-css')
  , minifyhtml = require('gulp-minify-html')
  , processhtml = require('gulp-processhtml')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
  , gutil = require('gulp-util')
  , sourcemaps = require('gulp-sourcemaps')
  , jshint = require('gulp-jshint')
  , browserify = require('browserify')
  , watchify = require('watchify')
  , transform = require('vinyl-transform')
  , uglify = require('gulp-uglify')
  , run = require('gulp-run')
  , jshint = require('gulp-jshint')
  , connect = require('gulp-connect')
  , asar = require('gulp-asar')
  , clean = require('gulp-clean')
  , paths;

paths = {
  assets: 'client/assets/**/*',
  css:    'client/css/*.css',
  js:     ['client/js/src/**/*.js', '!client/js/lib/**/*.js'],
  dist:   ['./dist/']
};

gulp.task('run', function () {
  return run('electron . ').exec();
});

// add custom browserify options here
var customOpts = {
  entries: 'client/js/src/main.js',
  debug: true
};

var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./client/js/dist'));
}

gulp.task('uglify', ['jshint'], function () {
  gulp.src(paths.js)
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe(uglify({outSourceMaps: false}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('clean', function(){
 return gulp.src('package',{ read:false})
 .pipe(clean({force:true}));
});

 gulp.task('copy-app',['clean'], function(){
   return gulp.src(['client/**/*', 'package.json'],{base:'.'})
   .pipe(gulp.dest('package'));
 });

 gulp.task('package', ['copy-app'],function(){
  return gulp.src('package/**/*')
    .pipe(asar('app.asar'))
    .pipe(gulp.dest('dist'));
 });


gulp.task('jshint', function() {
  gulp.src(paths.js)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('connect',  function() {
  connect.server({
    root: 'client',
    port: 9000,
    livereload: true//,
  });
});


gulp.task('html', function(){
  gulp.src('client/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(paths.js, ['js']);
  gulp.watch(['./client/index.html', paths.css, paths.js], ['html']);
});

gulp.task('default', ['connect', 'js', 'watch']);
