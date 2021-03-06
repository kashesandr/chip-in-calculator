var Vulcanize = require('vulcanize');
var gulp = require('gulp');
var through = require('through2');
var runSequence = require('run-sequence').use(gulp);
var del = require('del');
var crisper = require('gulp-crisper');
var uglifyJs = require('gulp-uglify');
var uglifyHtml = require('gulp-minify-html');
var uglifyCss = require('gulp-minify-css');

var vulcanize = new Vulcanize({
    inlineScripts: true,
    inlineCss: true,
    stripComments: true
});

var vulcanizeWrapper = function() {
    return through.obj(function(file, encoding, callback) {
        var gulpContext = this;
        vulcanize.process(file.path, function(err, data) {
            file.contents = new Buffer(data);
            gulpContext.push(file);
            callback();
        });
    });
};

gulp.task('clean', function(cb){
    del(['build/**/*'], cb)
});
gulp.task('vulcanize', function(){
    return gulp.src('src/components/cic-main/element.html')
        .pipe(vulcanizeWrapper())
        .pipe(crisper())
        .pipe(gulp.dest('build/components/cic-main'))
});
gulp.task('copy', function(){
    return gulp.src('src/index.html')
        .pipe(gulp.dest('build'))
});
gulp.task('minify:css', function(){
    return gulp.src('src/**/*.css')
        .pipe(uglifyCss())
        .pipe(gulp.dest('build'));
});
gulp.task('minify:js', function(){
    return gulp.src('build/**/*.js')
        .pipe(uglifyJs())
        .pipe(gulp.dest('build'));
});
gulp.task('minify:html', function(){
    return gulp.src('build/**/*.html')
        .pipe(uglifyHtml())
        .pipe(gulp.dest('build'));
});
gulp.task('copy_locales', function(){
    return gulp.src('src/locales/*.json')
        .pipe(gulp.dest('build/locales/'))
});

gulp.task('default', function() {
    return runSequence(
        'clean',
        'vulcanize',
        'copy',
        'copy_locales',
        //'minify:css',
        'minify:js',
        'minify:html'
    );
});
