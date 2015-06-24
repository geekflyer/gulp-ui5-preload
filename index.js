'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');

module.exports = function (options) {

	options = options || {};
	options.isLibrary = !!options.isLibrary;
	options.fileName = options.fileName || (options.isLibrary ? 'library-preload.json' : 'Component-preload.js');

	if (typeof options.base !== 'string') {
		throw new gutil.PluginError('gulp-ui5-preload', '`base` parameter required');
	}

	var firstFile;
	var preloadModules = {};

	function collectFileContentsFromStream(file, enc, done) {
		// ignore empty files
		if (file.isNull()) {
			return;
		}
		// we dont do streams (yet)
		if (file.isStream()) {
			return this.emit('error', new PluginError('gulp-ui5-preload', 'File Content streams not yet supported'));
		}
		if (!firstFile && file) {
			firstFile = file;
		}

		try {

			var resolvedPath = (options.namespace ? options.namespace.split('.').join('/') + '/' : '' ) + path.relative(path.resolve(options.base), file.path).replace(/\\/g, '/');
			preloadModules[resolvedPath] = file.contents.toString();

		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-ui5-preload', err));
		}
		done();
	}

	function pushCombinedFileToStream() {

		gutil.log('gulp-ui5-preload',
			gutil.colors.magenta(
				'number of files combined to preload file ' + options.fileName + ': ',
				Object.keys(preloadModules).length)
		);

		var template = 'jQuery.sap.registerPreloadedModules(JSON_CONTENT);';
		var suffix  = '.Component-preload';
		if (options.isLibrary) {
			template = 'JSON_CONTENT';
			suffix  = '.library-preload';
		}

		var jsonContent = JSON.stringify(
			{
				name: options.namespace + suffix,
				version: '2.0',
				modules: preloadModules
			},
			null,
			'\t'
		);

		var contents = template.replace('JSON_CONTENT', jsonContent);

		var preloadFile = firstFile.clone({contents: false});
		preloadFile.contents = new Buffer(contents);
		preloadFile.path = path.join(firstFile.base, options.fileName);

		this.push(preloadFile);
		this.emit('end');
	}

	return through.obj(collectFileContentsFromStream, pushCombinedFileToStream);
};
