'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');

module.exports = function (options) {

	options = options || {};

	options.fileName = options.fileName || 'Component-preload.js';
	if (!options.base) {
		throw new gutil.PluginError('gulp-ui5-preload', '`base` required');
	}

	var transformedContentsArr = [];
	var firstFile;

	function transformSingleFile(file, options) {

		var ui5Path = (options.namespace ? options.namespace.split('.').join('/') + '/' : '' ) + path.relative(path.resolve(options.base), file.path);
		var contents = file.contents.toString();

		if (/\.js$/.test(ui5Path)) {
			// Javascript file
			contents = 'function() {' + contents + '}';
		} else if (/\.xml$/.test(ui5Path)) {
			// XML file
			contents = contents.replace(/"/g, '\\"')
				.replace(/'/g, '\\\'')
				.replace(/(\r\n|\n|\r)/gm, '')
				.replace(/\t+/gm, ' ');
			contents = '\'' + contents + '\'';
		}
		contents = '\'' + ui5Path + '\': ' + contents;
		return contents;
	}

	function collectAndTransformFileContentsFromStream(file, enc, done) {
		// ignore empty files
		if (file.isNull()) {return;}
		// we dont do streams (yet)
		if (file.isStream()) {
			return this.emit('error', new PluginError('gulp-ui5-preload', 'Streaming not supported'));
		}
		if (!firstFile && file) {firstFile = file;}

		try {
			transformedContentsArr.push(transformSingleFile(file, options));
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-ui5-preload', err));
		}
		done();
	}

	function pushCombinedFilesToStream() {

		gutil.log('gulp-ui5-preload', gutil.colors.magenta('number of files combined to preload file ' + options.fileName + ': ', transformedContentsArr.length));

		if (transformedContentsArr.length === 0) {
			return this.emit('end');
		}

		var contents = 'jQuery.sap.registerPreloadedModules({"name" : "' + options.namespace + '.component-preload' + '",\n"version" : "2.0",' +
			'"modules" : {' + transformedContentsArr.join(',\n') + '}});';

		var preloadFile = firstFile.clone({contents: false});
		preloadFile.path = path.join(firstFile.base, options.fileName);
		preloadFile.contents = new Buffer(contents);

		this.push(preloadFile);
		this.emit('end');
	}

	return through.obj(collectAndTransformFileContentsFromStream, pushCombinedFilesToStream);
};
