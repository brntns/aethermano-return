var gulp = require('gulp')
  ,run = require('gulp-run')
  , jshint = require('gulp-jshint')
  , connect = require('gulp-connect')
  , asar = require('gulp-asar')
  , clean = require('gulp-clean')
  , paths;

paths = {
  assets: 'client/assets/**/*',
  css:    'client/css/*.css',
  js:     ['client/js/**/*.js', '!client/js/lib/**/*.js'],
  dist:   ['./dist/']
};

gulp.task('run', function () {
return run('electron . ').exec();
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
  gulp.watch(paths.js, ['jshint']);
  gulp.watch(['./client/index.html', paths.css, paths.js], ['html']);
});

gulp.task('default', ['connect', 'watch']);
gulp.task('build', ['package']);
