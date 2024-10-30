var gulp = require('gulp'),
    del = require('del'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    svgSprite = require('gulp-svg-sprite'),
    config = {
        shape: {
            dest: 'intermediate-svg',
            dimension: {
                maxWidth: 500,
                maxHeight: 500
            }
        },
        svg: {
            xmlDeclaration: false
        },
        mode: {
            symbol: {
                sprite: 'sprite.svg',
                example: false
            }
        }
    };

gulp.task('clean', function() {
    return del('./sprite/', {
        force: true
    });
});

gulp.task('svgSprite', function() {
    return gulp.src('assets/*.svg')
        // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill and style declarations in out shapes
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        // cheerio plugin create unnecessary string '>', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite(config))
        .pipe(gulp.dest('sprite'));
});