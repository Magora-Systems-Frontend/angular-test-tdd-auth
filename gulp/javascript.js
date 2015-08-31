var gIf = require('gulp-if'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    stylish = require('jshint-stylish'),
    concat = require('gulp-concat');

gulp.task('javascript', function () {

    return gulp.src(config['javascript']['src'])

        .pipe(jshint())
        .pipe(jshint.reporter(stylish))

        .pipe(concat(config['javascript']['dst']))
        .on('error', onErrors)

        .pipe(gIf(config.isProduction, uglify()))
        .on('error', onErrors)

        .pipe(gulp.dest(config['public']));
});