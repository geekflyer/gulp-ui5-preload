'use strict';
var gutil = require('gulp-util');
var ui5Preload = require('./');
var expect = require('code').expect;
var lab = exports.lab = require('lab').script();

lab.test('creates a preload file full of unicorns and zebras :-)', function (done) {
	var stream = ui5Preload({base: 'src/conf/ui', namespace: 'sap.pdms.fdn'});
	var expectedFile = 'jQuery.sap.registerPreloadedModules({\n\t"name": "sap.pdms.fdn.Component-preload",\n\t"version": "2.0",\n\t"modules": {\n\t\t"sap/pdms/fdn/app/unicorns.js": "unicorns",\n\t\t\"sap/pdms/fdn/app/zebras.xml": "zebras"\n\t}\n});';

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/src/conf/ui/app/unicorns.js',
		contents: new Buffer('unicorns')
	}));

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/src/conf/ui/app/zebras.xml',
		contents: new Buffer('zebras')
	}));

	stream.on('data', function (file) {
		expect(file.contents.toString()).to.equal(expectedFile);
		expect(file.path.split('/').pop()).to.equal('Component-preload.js');
	});

	stream.on('end', done);
	stream.end();
});
