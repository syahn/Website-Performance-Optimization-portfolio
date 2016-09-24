var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin'),
	responsive = require('gulp-responsive'),
	pump = require('pump'),
	beautify = require('gulp-beautify'),
	htmlminify = require("gulp-html-minify"),
    cssbeautify = require('gulp-cssbeautify'),
	ngrok = require('ngrok'),
	psi = require('psi'),
	sequence = require('run-sequence');

// Paths to various files
var paths = {
    scripts: ['src/js/**/*.js'],
    styles: ['src/css/*.css'],
    images: ['src/img/*.{png,jpg,svg}'],
    content: ['src/*.html']
};

var site = '';

/*
 *  Optimizing
 */

gulp.task('build-html' , function(){
    return gulp.src(paths.content)
        .pipe(htmlminify())
        .pipe(gulp.dest("dist/"));
});

gulp.task('minify-css', function() {
  return gulp.src(paths.styles)
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('imgOpt', () =>
    gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
);

gulp.task('compress', function (cb) {
  pump([
        gulp.src(paths.scripts),
        uglify(),
        gulp.dest('dist/js/')
    ],
    cb
  );
});

gulp.task('compress-views', function (cb) {
  pump([
        gulp.src('src/views/js/*.js'),
        uglify(),
        gulp.dest('dist/views/js/')
    ],
    cb
  );
});

gulp.task('minify-css-views', function() {
  return gulp.src('src/views/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/views/css'));
});

gulp.task('build-html-views' , function(){
    return gulp.src('src/views/*.html')
        .pipe(htmlminify())
        .pipe(gulp.dest("dist/views/"));
});

gulp.task('imgOpt-views', () =>
    gulp.src('src/views/images/*.{png,jpg,svg}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/views/images'))
);


/*
 *  Beautifying
 */


gulp.task('beautify', function() {
  gulp.src(paths.scripts)
    .pipe(beautify({indentSize: 4}))
    .pipe(gulp.dest('src/js'));
});


gulp.task('css-beautify', function() {
    return gulp.src(paths.styles)
        .pipe(cssbeautify())
        .pipe(gulp.dest('src/css'));;
});



gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('responsive', function () {
  return gulp.src('src/views/images/pizzeria.jpg')
    .pipe(responsive({
      '*.jpg': {
        width: 720,
        quality: 20
      }
      }))
    .pipe(gulp.dest('dist'));
});

gulp.task('ngrok-url', function(cb) {
  return ngrok.connect(8000, function (err, url) {
    site = url;
    console.log('serving your tunnel from: ' + site);
    cb();
  });
});

gulp.task('mobile', function () {
    return psi(site, {
        // key: key
        nokey: 'true',
        strategy: 'mobile',
    }).then(function (data) {
		console.log('Speed score: ' + data.ruleGroups.SPEED.score);
        console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
    });
});


gulp.task('desktop', function () {
    return psi(site, {
        nokey: 'true',
        // key: key,
        strategy: 'desktop',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
    });
});

// psi sequence with 'browser-sync-psi' instead
gulp.task('psi-seq', function (cb) {
  return sequence(
    'ngrok-url',
	'desktop',
	'mobile',
    cb
  );
});


gulp.task('psi', ['psi-seq'], function() {
  console.log('Woohoo! Check out your page speed scores!');
  process.exit();
});


gulp.task('watch', function(){
	gulp.watch(paths.content, ['build-html']);
	gulp.watch(paths.scripts, ['compress']);
	gulp.watch(paths.styles, ['minify-css']);
	gulp.watch(paths.images, ['imgOpt']);
	gulp.watch('src/views/*.html', ['build-html-views']);
	gulp.watch('src/views/js/*.js', ['compress-views']);
	gulp.watch('src/views/css/*.css', ['minify-css-views']);
	gulp.watch('src/views/images/*.{png,jpg,svg}', ['imgOpt-views']);
});

gulp.task('default', ['watch', 'compress', 'build-html', 'minify-css', 'imgOpt', 'compress-views', 'build-html-views', 'minify-css-views', 'imgOpt-views']);
// 'css-beautify', 'beautify',
