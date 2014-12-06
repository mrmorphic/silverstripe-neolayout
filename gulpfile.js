'use strict';

var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    react = require('gulp-react'),
    browserify = require('browserify'),
    transform = require('vinyl-transform'),
    uglify = require('gulp-uglify'),
    del = require('del');

gulp.task('css', function () {
    gulp.src('./styl/main.styl')
        .pipe(stylus())
        .pipe(gulp.dest('./css'));
});

gulp.task('js', function () {
    gulp.src('./jsx/**/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('./javascript/build')).on('end', function () {
            var browserified = transform(function(filename) {
                var b = browserify(filename);
                return b.bundle();
            });

            gulp.src(['./javascript/build/app.js'])
                .pipe(browserified)
                .pipe(uglify())
                .pipe(gulp.dest('./javascript')).on('end', function () {
                    del('./javascript/build/');
                });
        });
});

gulp.task('default', ['css', 'js']);
