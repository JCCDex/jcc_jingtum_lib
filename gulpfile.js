const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const shell = require('gulp-shell');

gulp.task('eslint', function() {
  return gulp.src(['src/**/*.js', 'lib/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: [
        ["@babel/preset-env", {
          "targets": {
            "browsers": ["last 2 versions"],
            "node": "8.11.3"
          }
        }]
      ],
      plugins: [
        "@babel/plugin-transform-runtime"
      ]
    }))
    .pipe(gulp.dest('dist/'))
})

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js', 'lib/**/*.js'], ['eslint']);
})
gulp.task('test', shell.task('gulp build && npm run test:node && npm run test:browser'));
gulp.task('default', gulp.parallel(['eslint', 'test']));
gulp.task('dev', gulp.parallel('watch', 'eslint'));