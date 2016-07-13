// include gulp
var gulp = require('gulp');

// include plugins
var autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	jade = require('gulp-jade'),
	jshint = require('gulp-jshint'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify');

// folders
var dist = 'dist/',
	distFonts = dist + 'fonts/',
	distImages = dist + 'img/',
	distJs = dist + 'js/',
	distStyle = dist + 'css/',
	distTemplates = dist,
	src = 'src/',
	srcFonts = src + 'fonts/*',
	srcImages = src + 'img/**/*',
	srcJs = src + 'js/**/*.js',
	srcStyle = src + 'scss/**/*.scss',
	srcTemplates = src + 'templates/**/*';

// default task
gulp.task('default', ['watch', 'browser-sync']);

// watch files
gulp.task('watch', ['deleteDist', 'fonts', 'img', 'js', 'css', 'templates'], function() {
	gulp.watch(srcFonts, ['fonts']);
	gulp.watch(srcImages, ['img']);
	gulp.watch(srcJs, ['js']);
	gulp.watch(srcStyle, ['css']);
	gulp.watch(srcTemplates, ['templates']);
});

// browser-sync server
gulp.task('browser-sync', function() {

	browserSync.init({
		// proxy to nodemon server
		// proxy: 'localhost:4000',
		// port to access in browser, default 3000
		// port: 3000,
		// file to serve
		server: {
			baseDir: 'dist',
			index: 'index.html'
		},
		// don't automatically open in browser, default true
		open: false
	});

});

// delete dist
gulp.task('deleteDist', function() {
	return del.sync(dist);
})

// copy fonts
gulp.task('fonts', function() {
	return gulp.src(srcFonts)
		.pipe(gulp.dest(distFonts))
		.pipe(browserSync.stream());
});

// copy images
gulp.task('img', function() {
	return gulp.src(srcImages)
		.pipe(imagemin())
		.pipe(gulp.dest(distImages))
		.pipe(browserSync.stream());
});

// create template
gulp.task('templates', function() {
	return gulp.src(srcTemplates)
		.pipe(jade({
			pretty: '\t',
		}))
		.pipe(gulp.dest(distTemplates))
		.pipe(browserSync.stream());
});

// js lint task
gulp.task('lint', function() {
	return gulp.src(srcJs)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// compile sass
gulp.task('css', function() {
	return gulp.src(srcStyle)
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(plumber())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'last 3 iOS versions'],
			cascade: false,
			flexbox: true,
		}))
		.pipe(gulp.dest(distStyle))
		.pipe(browserSync.stream());
});

// concatenate & minify js
gulp.task('js', function() {
	return gulp.src(srcJs)
		.pipe(gulp.dest(distJs))
		.pipe(browserSync.stream());
});
