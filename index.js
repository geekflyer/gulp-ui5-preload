'use strict';
var PluginError = require('plugin-error');
var log = require('fancy-log');
var colors = require('ansi-colors');
var through = require('through2');
var path = require('path');

module.exports = function (options) {

	options = options || {};
	options.isLibrary = !!options.isLibrary;
	options.fileName = options.fileName || ((options.isLibrary ? 'library-preload.' : 'Component-preload.') + (options.format || 'js'));

	if (typeof options.base !== 'string') {
		throw new PluginError('gulp-ui5-preload', '`base` parameter required');
	}

	var firstFile;
	var preloadModules = {};

	function collectFileContentsFromStream(file, enc, done) {
		// ignore empty files
		if (file.isNull()) {
			done();
			return;
		}
		// we dont do streams (yet)
		if (file.isStream()) {
			this.emit('error', new PluginError('gulp-ui5-preload', 'File Content streams not yet supported'));
			done();
			return;
		}
		if (!firstFile && file) {
			firstFile = file;
		}

		try {

			var resolvedPath = (options.namespace ? options.namespace.split('.').join('/') + '/' : '' ) + path.relative(path.resolve(options.base), file.path).replace(/\\/g, '/');
			preloadModules[resolvedPath] = file.contents.toString();

		} catch (err) {
			this.emit('error', new PluginError('gulp-ui5-preload', err));
			done();
			return;
		}
		done();
	}

	function pushCombinedFileToStream(done) {

		if (!firstFile) {
			done();
			log.error('gulp-ui5-preload', colors.red('WARNING: No files were passed to gulp-ui5-preload. Wrong path?. Skipping emit of Component-preload.js...'));
			return;
		}

		log.info('gulp-ui5-preload',
			colors.magenta('number of files combined to preload file ' + options.fileName + ': ' +  Object.keys(preloadModules).length)
		);

		var template = 'jQuery.sap.registerPreloadedModules(JSON_CONTENT);';
		var suffix  = '.Component-preload';
		if (options.isLibrary) {
			suffix  = '.library-preload';
		}
		if (options.fileName.slice(-4) === 'json') {
			template = 'JSON_CONTENT';
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

		var contents = template.replace('JSON_CONTENT', function () {
			return jsonContent;
		});

		var preloadFile = firstFile.clone({contents: false});
		preloadFile.contents = new Buffer(contents);
		preloadFile.path = path.join(firstFile.base, options.fileName);

		this.push(preloadFile);
		done();
	}

	return through.obj(collectFileContentsFromStream, pushCombinedFileToStream);
};
