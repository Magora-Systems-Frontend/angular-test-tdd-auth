gulp = require('gulp');
dir = require('require-dir');

config = require('./config.json');

var knownOptions = {
    string: 'env',
    default: {env: process.env.NODE_ENV || 'dev'}
};
var minimist = require('minimist');

var options = minimist(process.argv.slice(2), knownOptions);

if (options['env'] === 'production') {
    config.isProduction = true;
    console.log('Production build')
}
modules = {};

onErrors = function (error) {
    console.log(error.toString());
};

dir('./gulp');

gulp.task('default', ['build'], function(){
    gulp.start('watch');
});

