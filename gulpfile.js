const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');
const istanbul = require('gulp-istanbul');
const babel = require('gulp-babel');
const isparta = require('isparta');

gulp.task('eslint', function () {
    return gulp.src(['src/**/*.js', 'lib/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('pre-test', function () {
    return gulp.src(['src/**/*.js', 'lib/**/*.js'])
        .pipe(istanbul({
            instrumenter: isparta.Instrumenter
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task('build', function () {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: [
                ["env", {
                    "targets": {
                        "browsers": ["last 2 versions"],
                        "node": "8.11.3"
                    }
                }]
            ],
            plugins: [
                "transform-runtime"
            ]
        }))
        .pipe(gulp.dest('dist/'))
})

gulp.task('test', ['pre-test'], function () {
    return gulp.src(['test/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({
            thresholds: {
                global: 90
            }
        }))
        .on('error', gutil.log);
});

gulp.task('watch', function () {
    gulp.watch(['src/**/*.js', 'lib/**/*.js', 'src/test/*.js'], ['test']);
    gulp.watch(['src/**/*.js', 'lib/**/*.js'], ['eslint']);
})

gulp.task('default', ['eslint', 'test']);
gulp.task('dev', ['eslint', 'test', 'watch']);