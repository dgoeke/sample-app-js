const gulp = require('gulp');
const sass = require('gulp-sass');

/**
 * Copy the static assets from the design system, such as the fonts and images.
 * We could do this manually, but why not automate it so it's easy to do
 * as things are updated :)
 */
gulp.task('copy-design-system', function() {
  return gulp
    .src([
      'node_modules/@cmsgov/design-system-core/**/fonts/*',
      'node_modules/@cmsgov/design-system-core/**/images/*',
      'node_modules/@cmsgov/design-system-core/dist/index.css'
    ])
    .pipe(gulp.dest('./dist'));
});

gulp.task('design-css', function() {
  return gulp
    .src([
      'node_modules/@cmsgov/design-system-core/dist/index.css'
    ])
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('default', ['copy-design-system','design-css']);