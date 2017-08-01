const gulp = require('gulp');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const ghPages = require('gulp-gh-pages');
const zip = require('gulp-zip');

gulp.task('zip', ['build'], function() {
    return gulp.src(['./dist/**', '!./dist/stream-catch.zip'])
        .pipe(zip('stream-catch.zip'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('deploy', ['zip'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('sass', () => {
    return gulp.src('./src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('copy', () => {
    return gulp.src([
            './src/manifest.json',
            './src/**/*.html',
            './src/icons/**/*.png'
        ], { base: './src/'})
        .pipe(gulp.dest('./dist'));
});

gulp.task('scripts', () => {
    return gulp.src('./src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('lint', () => {
    return gulp.src('./src/**/*.js')
        .pipe(
            eslint({
                fix: true
            })
        )
        .pipe(eslint.format())
        .pipe(gulp.dest('./src'));
});

gulp.task('watch', () => {
	gulp.watch('./src/scripts/**/*.js', ['lint', 'scripts']);
    gulp.watch('./src/styles/**/*.scss', ['sass']);
    gulp.watch([
        './src/**/*.html',
        './src/manifest.json',
        './src/icon.png'
    ], ['copy']);
});

gulp.task('test', () => {
	return gulp.src(['test/*.js'])
        .pipe(mocha({
            compilers: 'js:babel-register'
		}));
});

gulp.task('build', ['lint', 'scripts', /*'test',*/ 'sass', 'copy']);
gulp.task('default', ['build', 'watch']);
