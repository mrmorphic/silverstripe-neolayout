'use strict';

var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    react = require('gulp-react'),
    browserify = require('gulp-browserify');

gulp.task('stylus', function () {
    gulp.src('./styl/main.styl')
        .pipe(stylus())
        .pipe(gulp.dest('./css'));
});

gulp.task('jsx', function (done) {
    gulp.src('./jsx/**/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('./javascript/build'));

    done();
});

gulp.task('browserify', function (done) {
    gulp.src('./javascript/build/app.js')
        .pipe(browserify())
        .pipe(gulp.dest('./javascript'));

    done();
});

gulp.task('default', ['stylus', 'jsx', 'browserify'], function () {});
