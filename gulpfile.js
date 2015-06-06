'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var minimist = require('minimist');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');

var knownOptions = {
    string: ['env', 'smp'],
    default: {
        env: process.env.NODE_ENV || 'production',
        smp: '/path/to/project/root/'
    }
};

var options = minimist(process.argv.slice(2), knownOptions);
var _debug = options.env === 'development' ? true : false;

gulp.task('js:compile-synth', function() {
    return browserify({ debug: _debug })
        .transform(babelify.configure({
          sourceMapRelative: options.smp
        }))
        .require('./public/js/src/main.js', {
            entry: true
        })
        .bundle()
        .on('error', function (err) {
            console.log('Error : ' + err.message);
        })
        .pipe(source('synth-bundle.js'))
        .pipe(gulpif(options.env === 'production', buffer()))
        .pipe(gulpif(options.env === 'production', uglify()))
        .pipe(gulp.dest('./public/js/dist'));
});

gulp.task('js:compile-remote', function() {
    return browserify({ debug: _debug })
        .transform(babelify.configure({
          sourceMapRelative: options.smp
        }))
        .require('./public/js/src/controller/filter-mod.js', {
            entry: true
        })
        .bundle()
        .on('error', function (err) {
            console.log('Error : ' + err.message);
        })
        .pipe(source('controller-bundle.js'))
        .pipe(gulpif(options.env === 'production', buffer()))
        .pipe(gulpif(options.env === 'production', uglify()))
        .pipe(gulp.dest('./public/js/dist'));
});

gulp.task('clean', function () {
    return  del(['dist/**']);
});

gulp.task('js:compile', ['clean'], function() {
    gulp.start('js:compile-synth');
    gulp.start('js:compile-remote');
});

gulp.task('default', function () {
    gulp.start('js:compile');
    watch('./public/js/src/*.js', function () {
        gulp.start('js:compile');
    });
});
