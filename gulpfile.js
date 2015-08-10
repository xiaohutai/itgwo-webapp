// FOUNDATION FOR APPS TEMPLATE GULPFILE
// -------------------------------------
// This file processes all of the assets in the "client" folder, combines them with the Foundation for Apps assets, and outputs the finished files in the "build" folder as a finished app.

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var $        = require('gulp-load-plugins')();
var argv     = require('yargs').argv;
var gulp     = require('gulp');
var rimraf   = require('rimraf');
var router   = require('front-router');
var sequence = require('run-sequence');
var manifest = require('gulp-manifest');
var phonegapBuild = require('gulp-phonegap-build');
var minifyCss     = require('gulp-minify-css');
var exec = require('child_process').exec;

// Check for --production flag
var isProduction = !!(argv.production);

// 2. FILE PATHS
// - - - - - - - - - - - - - - -

var paths = {
  assets: [
    './client/**/*.*',
    '!./client/templates/**/*.*',
    '!./client/assets/{scss,js}/**/*.*'
  ],
  // Sass will check these folders for files when you use @import.
  sass: [
    'client/assets/scss',
    'bower_components/foundation-apps/scss'
  ],
  // These files include Foundation for Apps and its dependencies
  foundationJS: [
    'bower_components/fastclick/lib/fastclick.js',
    'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
    'bower_components/tether/tether.js',
    'bower_components/hammerjs/hammer.js',
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-sanitize/angular-sanitize.js',
    'bower_components/foundation-apps/js/vendor/**/*.js',
    'bower_components/foundation-apps/js/angular/**/*.js',
    // 'bower_components/angular-i18n/angular-locale_en-gb.js',
    'bower_components/angular-i18n/angular-locale_nl-nl.js', // determine what the best way is to dynamically load locales files.
    '!bower_components/foundation-apps/js/angular/app.js',
    'bower_components/angular-piwik/angular-piwik.js'
  ],
  // These files are for your app's JavaScript
  appJS: [
    'client/assets/js/**/*.js'
  ]
}

// 3. TASKS
// - - - - - - - - - - - - - - -

// Cleans the build directory
gulp.task('clean', function(cb) {
  rimraf('./html', cb);
});

// Copies everything in the client folder except templates, Sass, and JS
gulp.task('copy', function() {
  return gulp.src(paths.assets, {
    base: './client/'
  })
    .pipe(gulp.dest('./html'))
  ;
});

// Copies your app's page templates and generates URLs for them
gulp.task('copy:templates', function() {
  return gulp.src('./client/templates/**/*.html')
    .pipe(router({
      path: 'html/assets/js/routes.js',
      root: 'client'
    }))
    .pipe(gulp.dest('./html/templates'))
  ;
});

// Compiles the Foundation for Apps directive partials into a single JavaScript file
gulp.task('copy:foundation', function(cb) {
  gulp.src('bower_components/foundation-apps/js/angular/components/**/*.html')
    .pipe($.ngHtml2js({
      prefix: 'components/',
      moduleName: 'foundation',
      declareModule: false
    }))
    .pipe($.uglify())
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest('./html/assets/js'))
  ;

  // Iconic SVG icons
  // gulp.src('./bower_components/foundation-apps/iconic/**/*')
  //  .pipe(gulp.dest('./html/assets/img/iconic/'))
  //;

  cb();
});

// Compiles Sass
gulp.task('sass', function () {
  return gulp.src('client/assets/scss/app.scss')
    .pipe($.sass({
      includePaths: paths.sass,
      outputStyle: (isProduction ? 'compressed' : 'nested'),
      errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('./html/assets/css/'))
  ;
});

// Compiles and copies the Foundation for Apps JavaScript, as well as your app's custom JS
gulp.task('uglify', ['uglify:foundation', 'uglify:app'])

gulp.task('uglify:foundation', function(cb) {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths.foundationJS)
    .pipe(uglify)
    .pipe($.concat('foundation.js'))
    .pipe(gulp.dest('./html/assets/js/'))
  ;
});

gulp.task('uglify:app', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths.appJS)
    .pipe(uglify)
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./html/assets/js/'))
  ;
});

// Starts a test server, which you can view at http://localhost:8080
gulp.task('server', ['build'], function() {
  gulp.src('./html')
    .pipe($.webserver({
      port: 8080,
      host: 'localhost',
      fallback: 'index.html',
      livereload: true,
      open: true
    }))
  ;
});

gulp.task('create-icons', function (cb) {
  exec('sh phonegap-icon-splash-generator.sh icon_splash/icon.png "#333" client/assets', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('manifest', function(){
  gulp.src(['html/**/*'])
    .pipe(manifest({
      hash: true,
      preferOnline: true,
      network: ['*'],
      filename: 'app.manifest',
      exclude: 'app.manifest'
     }))
    .pipe(gulp.dest('html'));
});

gulp.task('phonegap-build', function () {
  gulp.src('./html/**/*')
    .pipe(phonegapBuild({
      "appId": "1576214",
      "user": {
        "email": "marcel@twokings.nl",
        "password": "YjxUxesUpA8Ze6u"
      },
      keys: {
        // ios: { "password": "r5Xb4M4S3rjTA3WL" }, // Production
        ios: { "password": "GQakXS4ymW8h4jEZ" }, // Development
        android: { "key_pw": "gRmfh4fRVL5S", "keystore_pw": "gRmfh4fRVL5S" }
      },
      download: {
        ios: 'dist/itgwo.ipa',
        android: 'dist/itgwo.apk'
      }
    }));
});

// Builds your entire app once, without starting a server
gulp.task('build', function(cb) {
  sequence('clean', ['copy', 'copy:foundation', 'sass', 'uglify'], [ 'copy:templates'], ['manifest'] , cb);
  //, 'create-icons'
});

function watch () {
  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass']);

  // Watch JavaScript
  gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['uglify:app']);

  // Watch static files
  gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy']);

  // Watch app templates
  gulp.watch(['./client/templates/**/*.html'], ['copy:templates']);
}


// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('default', ['server'], watch);

// gulp watch
// gulp watch --production
gulp.task('watch', ['build'], watch);


// Builds your entire app, creates icons, builds phonegap apps
gulp.task('phonegap', function(cb) {
  sequence('build', 'phonegap-build', cb);
});


