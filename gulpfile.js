var gulp           = require('gulp'),
	gutil          = require('gulp-util' ),
	sass           = require('gulp-sass'),
	browserSync    = require('browser-sync'),
	concat         = require('gulp-concat'),
	uglify         = require('gulp-uglify'),
	cleanCSS       = require('gulp-clean-css'),
	rename         = require('gulp-rename'),
	del            = require('del'),
	imagemin       = require('gulp-imagemin'),
	cache          = require('gulp-cache'),
	autoprefixer   = require('gulp-autoprefixer'),
	ftp            = require('vinyl-ftp'),
	notify         = require("gulp-notify"),
	gulp 		   = require('gulp');
	babel 		   = require('gulp-babel');



gulp.task('js', function () {
	return gulp.src([
		// 'node_modules/babel-polyfill/dist/polyfill.js',
		'src/js/libs/*.js',
		'src/js/scripts.js'
	])
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify())  // minification js
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({ stream: true }))
});



gulp.task('browser-sync', function() {
	browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
});

gulp.task('sass', function() {
	return gulp.src(['src/sass/**/*.sass', 'src/sass/**/*.scss', 'src/sass/**/*.css'])
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 10 versions']))
	// .pipe(cleanCSS()) // minification css
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch(['libs/**/*.js', 'src/**/*.js'], ['js']);
	gulp.watch('dist/**/*.php', browserSync.reload);
	gulp.watch('dist/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], function() {

	var buildFiles = gulp.src([
		'src/*.html',
		'src/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'src/css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'src/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'src/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});


gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);


// MINIFICATION SiNGLE JS FILE 
// Common
// gulp.task('common-js', function() {
// 	return gulp.src([
// 		'src/js/common.js',
// 		])
// 	.pipe(concat('common.min.js'))
// 	// .pipe(uglify())
// 	.pipe(gulp.dest('dist/js'))
// 	.pipe(browserSync.reload({ stream: true }))
// });
// Common
// gulp.task('js', [
// 	'common-js'
// 	], function() {
// 	return gulp.src([
// 		'src/js/common.js',
// 		])
// 	.pipe(concat('scripts.min.js'))
// 	//.pipe(uglify()) // Минимизировать весь js (на выбор)
// 	.pipe(gulp.dest('dist/js'))
// 	.pipe(browserSync.reload({stream: true}))
// });
// END__MINIFICATION SiNGLE JS FILE 