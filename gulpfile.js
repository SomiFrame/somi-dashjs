var gulp = require('gulp'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    glob = require('glob'),
    es = require('event-stream');

gulp.task('js', function (cb) {
    glob('./test/*.js', function (err, files) {
        if (err) cb(err);
        var tasks = files.map(function (entry,index,arr) {
            return browserify({
                entries: [entry]
            }).transform("babelify",{presets: ["es2015","react"]})
                .bundle()
                .pipe(source(entry.match(/[^\\/]+$/)[0]))
                .pipe(gulp.dest('./public/js'));
        });
        es.merge(tasks).on('end', cb);
    });
});

gulp.task('watch', function () {
    gulp.watch('test/*.js', ['js']);
});

gulp.task('default', ['js']);