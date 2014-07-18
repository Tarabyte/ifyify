/*jshint node:true*/
var gulp = require('gulp');
var hint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');

var through = require('through2');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');

var allJs = 'src/*.js';
var allTests = 'test/*.js';
var libName = 'ifyify.js',
    libPath = path.join('src', libName),
    notLibPath = '!' + libPath;

gulp.task('hint', function() {
    return gulp.src(allJs)
    .pipe(hint())
    .pipe(hint.reporter('default'));
});

/**
 * Load all src files.
 */
function build() {
    var files = [],
        stream = through.obj(function(file, _, next) {
            files.push(file);
            return next();
    }, function() {
            var all = files.reduce(function(acc, file) {
                var filePath = file.path,
                    module,
                    fileName = './' + path.basename(filePath), //this line sucks. How to add trailing dot?
                    loadStr = 'require(\'' + fileName +'\')';

                delete require.cache[require.resolve(filePath)]; //remove cached version
                module = require(filePath);

                if(typeof module === 'function') {
                    acc.push((module.name || path.basename(filePath, '.js')) + ': ' + loadStr);
                }
                else {
                    Object.keys(module).forEach(function(name) {
                        acc.push(name + ': ' + loadStr +'.' + name);
                    });
                }

                return acc;
            }, []);

            this.push(new gutil.File({
                path: libName,
                contents: new require('buffer').Buffer('/*This file is autogenerated by build script. Do not modify.*/\n' +
                                                       '/*jshint node:true*/\n' +
                                                       'module.exports = {\n\t' + all.join(',\n\t') + '\n};')
            }));
    });

    return stream;
}

gulp.task('build', function() {
    gulp.src([allJs, notLibPath])
        .pipe(build())
        .pipe(gulp.dest('./src'));
});

gulp.task('test', function() {
    return gulp.src(allTests)
    .pipe(mocha({
        reporter: 'nyan'
    }));
});

gulp.task('watch', function () {
    watch({ //gulp.watch doesn't work with new files :(
        glob: [allJs, notLibPath],
        emitOnGlob: false //we don't need to rebuild when launched
    }, function() { //rebuild
        gulp.start('build');
    });

    gulp.watch(libPath, ['hint', 'test']);
    gulp.watch(allTests, ['test']);
});

gulp.task('default', ['hint', 'build', 'test', 'watch']);
