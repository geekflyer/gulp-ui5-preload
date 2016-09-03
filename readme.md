# gulp-ui5-preload [![Build Status](https://travis-ci.org/geekflyer/gulp-ui5-preload.svg?branch=master)](https://travis-ci.org/geekflyer/gulp-ui5-preload) [![npm version](https://badge.fury.io/js/gulp-ui5-preload.svg)](http://badge.fury.io/js/gulp-ui5-preload)

Creates a Component-preload.js or library-preload.json file for openui5 / sapui5 projects. Creating a prelaod file can speed up the initial load time of your webapp, by reducing the number of HTTP requests / roundtrips to load your code. The preload file can combine your `js` artifacts, `xml`, `html` and `json` views as well as `.properties` files into a single `Component-preload.js` / `library-preload.json` file.

## Install

```sh
$ npm install --save-dev gulp-ui5-preload
```

## Usage

Simple example.

```js
var ui5preload = require('gulp-ui5-preload');

gulp.task('ui5preload', function(){
  return gulp.src([
					'src/ui/**/**.+(js|xml)',
					'!src/ui/thirdparty/**' //exclude files that don't belong in preload (optional)
                  ])
          .pipe(ui5preload({base:'src/ui',namespace:'my.project.ui'}))
          .pipe(gulp.dest('dist'));
     })
```

Example with uglify / minify js and xml.

```js
// npm install --save-dev gulp-ui5-preload gulp-uglify gulp-pretty-data gulp-if
var ui5preload = require('gulp-ui5-preload');
var uglify = require('gulp-uglify');
var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');

gulp.task('ui5preload', function(){
  return gulp.src([
					'src/ui/**/**.+(js|xml)',
					'!src/ui/thirdparty/**'
                  ])
          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify
          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata 
          .pipe(ui5preload({base:'src/ui',namespace:'my.project.ui'}))
          .pipe(gulp.dest('dist'));
     })
```

## API

### ui5Preload(options) -> vinyl through-stream

Accepts an options object.
Returns a vinyl through-stream which collects all .xml and .js files and emits a single vinyl file (Component-preload.js / library-preload.json) which is passed downstream.

#### options

##### base
* *required*
* Type: `string`  

The base / entry path of your app. Usually the same location where your index.html and the Component.js resides. Can also be just `'./'` to point to the root of your project.

##### namespace
* Type: `string`
* Default: ''
* Example: `my.company.app`


The namespace at the `base` path. All source files are treated as sub-namespaces of this namespace, relative to the `base` path.

##### fileName
* Type: `string`
* Default: 'Component-preload.js' or 'library-preload.json' (depends on `isLibrary` option)

File name of the combined file to emit.

##### isLibrary
* Type: `boolean`
* Default: false

If set to `true` a `library-preload.json` file is emitted instead of a `Component-preload.js` file (default). The emitted file contents between those options vary a little bit.

## License

Apache 2.0 © [Christian Theilemann](https://github.com/geekflyer)
