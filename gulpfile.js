//sudo npm install gulp -g
// install chrome extension from https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
//Go into the settings from the plugin in Chrome and check the option for file urls: chrome://extensions/


// include gulp
var gulp = require('gulp'); 
 
// include plug-ins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();
var express = require('express');
var app = express();
var less = require('gulp-less');
var path = require('path');



 
// JS hint task
gulp.task('jshint', function() {
  gulp.src('./src/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(livereload(server));
});

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './src/images/**/*',
      imgDst = './build/images';
 
  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst))
    .pipe(livereload(server));
});

// minify new or changed HTML pages
gulp.task('htmlpage', function() {
  var htmlSrc = './src/*.html',
      htmlDst = './build';
 
  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst))
    .pipe(livereload(server));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src(['./src/scripts/lib.js','./src/scripts/*.js'])
    .pipe(concat('script.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./build/scripts/'))
    .pipe(livereload(server));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src(['./src/styles/bootstrap.css'])
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/styles/'))
   .pipe(livereload(server));
});

// Start Express
gulp.task('express', function() {
  app.use(express.static(__dirname + '/build/')),
  app.listen(8081);
});


// less
gulp.task('less', function () {
  gulp.src('./src/styles/less/bootstrap.less')
    .pipe(less({
      //   paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./src/styles/'));
});





// default gulp task
gulp.task('default', ['imagemin', 'htmlpage', 'scripts', 'less','styles', 'express'], function() {

// start the watching server 
server.listen(4041, function (err) { if (err) return console.log(err);



     

      // watch for HTML changes
      gulp.watch('./src/*.html', function() {
        gulp.run('htmlpage');
      });
     
      // watch for JS changes
      gulp.watch('./src/scripts/*.js', function() {
        gulp.run('jshint', 'scripts');
      });

        // watch for IMG changes
      gulp.watch('./src/images/*.png', function() {
        gulp.run('imagemin');
      });

       // watch for less changes
      gulp.watch('./src/styles/less/*.less', function() {
        gulp.run('less');
      });
     
      // watch for CSS changes
      gulp.watch('./src/styles/*.css', function() {
        gulp.run('styles');
      });
    });
});
