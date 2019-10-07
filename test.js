'use strict';
var Vinyl = require('vinyl');
var path = require('path');
var ui5Preload = require('./');
var expect = require('code').expect;
var lab = exports.lab = require('lab').script();

lab.test('creates a preload file full of unicorns and zebras :-)', function (done) {
	var stream = ui5Preload({base: 'src/conf/ui', namespace: 'sap.pdms.fdn'});
	var expectedFile = 'jQuery.sap.registerPreloadedModules({\n\t"name": "sap.pdms.fdn.Component-preload",\n\t"version": "2.0",\n\t"modules": {\n\t\t"sap/pdms/fdn/app/unicorns.js": "unicorns",\n\t\t\"sap/pdms/fdn/app/zebras.xml": "zebras"\n\t}\n});';

	stream.write(new Vinyl({
		base: __dirname,
		path: __dirname + '/src/conf/ui/app/unicorns.js',
		contents: new Buffer('unicorns')
	}));

	stream.write(new Vinyl({
		base: __dirname,
		path: __dirname + '/src/conf/ui/app/zebras.xml',
		contents: new Buffer('zebras')
	}));

	stream.on('data', function (file) {
		expect(file.contents.toString()).to.equal(expectedFile);
		expect(file.path.split(path.sep).pop()).to.equal('Component-preload.js');
	});

	stream.on('end', done);
	stream.end();
});

lab.test('creates a library-preload.js file full of unicorns and zebras :-)', function (done) {
	var stream = ui5Preload({base: 'src/conf/ui', namespace: 'sap.pdms.fdn', isLibrary: true});
	var expectedFile = 'jQuery.sap.registerPreloadedModules({\n\t"name": "sap.pdms.fdn.library-preload",\n\t"version": "2.0",\n\t"modules": {\n\t\t"sap/pdms/fdn/app/unicorns.js": "unicorns",\n\t\t\"sap/pdms/fdn/app/zebras.xml": "zebras"\n\t}\n});';

	stream.write(new Vinyl({
		base: __dirname,
		path: __dirname + '/src/conf/ui/app/unicorns.js',
		contents: new Buffer('unicorns')
	}));

	stream.write(new Vinyl({
		base: __dirname,
		path: __dirname + '/src/conf/ui/app/zebras.xml',
		contents: new Buffer('zebras')
	}));

	stream.on('data', function (file) {
		expect(file.contents.toString()).to.equal(expectedFile);
		expect(file.path.split(path.sep).pop()).to.equal('library-preload.js');
	});

	stream.on('end', done);
	stream.end();
});

lab.test('creates a library-preload.json file full of unicorns and zebras :-)', function (done) {
	var stream = ui5Preload({base: 'src/conf/ui', namespace: 'sap.pdms.fdn', isLibrary: true, format: 'json'});
	var expectedFile = '{\n\t"name": "sap.pdms.fdn.library-preload",\n\t"version": "2.0",\n\t"modules": {\n\t\t"sap/pdms/fdn/app/unicorns.js": "unicorns",\n\t\t\"sap/pdms/fdn/app/zebras.xml": "zebras"\n\t}\n}';

	stream.write(new Vinyl({
		base: __dirname,
		path: __dirname + '/src/conf/ui/app/unicorns.js',
		contents: new Buffer('unicorns')
	}));

	stream.write(new Vinyl({
		base: __dirname,
		path: __dirname + '/src/conf/ui/app/zebras.xml',
		contents: new Buffer('zebras')
	}));

	stream.on('data', function (file) {
		expect(file.contents.toString()).to.equal(expectedFile);
		expect(file.path.split(path.sep).pop()).to.equal('library-preload.json');
	});

	stream.on('end', done);
	stream.end();
});

lab.test('creates a foo.js file full of unicorns and zebras :-)', function (done) {
	var stream = ui5Preload({base: 'src/conf/ui', namespace: 'sap.pdms.fdn', isLibrary: true, fileName: 'foo.js'});
	var expectedFile = 'jQuery.sap.registerPreloadedModules({\n\t"name": "sap.pdms.fdn.library-preload",\n\t"version": "2.0",\n\t"modules": {\n\t\t"sap/pdms/fdn/app/unicorns.js": "unicorns",\n\t\t\"sap/pdms/fdn/app/zebras.xml": "zebras"\n\t}\n});';

	stream.write(new Vinyl({
		base: __dirname,
		path: __dirname + '/src/conf/ui/app/unicorns.js',
		contents: new Buffer('unicorns')
	}));

	stream.write(new Vinyl({
		base: __dirname,
		path: __dirname + '/src/conf/ui/app/zebras.xml',
		contents: new Buffer('zebras')
	}));

	stream.on('data', function (file) {
		expect(file.contents.toString()).to.equal(expectedFile);
		expect(file.path.split(path.sep).pop()).to.equal('foo.js');
	});

	stream.on('end', done);
	stream.end();
});

lab.test('creates a foo.json file full of unicorns and zebras :-)', function (done) {
	var stream = ui5Preload({base: 'src/conf/ui', namespace: 'sap.pdms.fdn', isLibrary: true, fileName: 'foo.json'});
	var expectedFile = '{\n\t"name": "sap.pdms.fdn.library-preload",\n\t"version": "2.0",\n\t"modules": {\n\t\t"sap/pdms/fdn/app/unicorns.js": "unicorns",\n\t\t\"sap/pdms/fdn/app/zebras.xml": "zebras"\n\t}\n}';

	stream.write(new Vinyl({
		base: __dirname,
		path: __dirname + '/src/conf/ui/app/unicorns.js',
		contents: new Buffer('unicorns')
	}));

	stream.write(new Vinyl({
		base: __dirname,
		path: __dirname + '/src/conf/ui/app/zebras.xml',
		contents: new Buffer('zebras')
	}));

	stream.on('data', function (file) {
		expect(file.contents.toString()).to.equal(expectedFile);
		expect(file.path.split(path.sep).pop()).to.equal('foo.json');
	});

	stream.on('end', done);
	stream.end();
});
