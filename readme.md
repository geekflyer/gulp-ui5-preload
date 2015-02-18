# gulp-ui5-preload [![Build Status](https://travis-ci.org/geekflyer/gulp-ui5-preload.svg?branch=master)](https://travis-ci.org/geekflyer/gulp-ui5-preload) [![npm version](https://badge.fury.io/js/gulp-ui5-preload.svg)](http://badge.fury.io/js/gulp-ui5-preload)

Creates a Component-preload.js file for openui5 / sapui5 projects. Supports .js and .xml artifacts.

## Install

```sh
$ npm install --save-dev gulp-ui5-preload
```

## Usage

Simple example.

```js
var ui5Preload = require('gulp-ui5-preload');

gulp.task('ui5preload', function(){
  return gulp.src([
					'src/ui/**/**.+(js|xml)',
					'!src/ui/**.**'     // exclude files in project root (e.g. Component.js)
                  ])
          .pipe(uglify())
          .pipe(ui5preload({base:'src/ui',namespace:'my.project.ui'}))
          .pipe(gulp.dest('dist'));
     })
```

Example with uglify / minify js.

```js
var ui5Preload = require('gulp-ui5-preload');
var uglify = require('gulp-uglify');
var jsFilter = require('gulp-filter')('**/**.js');

gulp.task('ui5preload', function(){
  return gulp.src([
					'src/ui/**/**.+(js|xml)',
					'!src/ui/**.**'
                  ])
          .pipe(jsFilter)            // only pass js files to uglifyjs (no xml files).
          .pipe(uglify())
          .pipe(jsFilter.restore())  // reset filter
          .pipe(ui5preload({base:'src/ui',namespace:'my.project.ui'}))
          .pipe(gulp.dest('dist'));
     })
```

## API

### ui5Preload(options) -> vinyl through-stream

Accepts an options object.
Returns a vinyl through-stream which collects all .xml and .js files and emits a single vinyl file (Component-preload.js) which is passed downstream.

#### options

##### base
* *required*
* Type: `string`  

The base / entry path of your app. Usually the same location where your index.html and the Component.js resides. Can also be just `'./'` to point to the root of your project.

##### namespace
* Type: `string`
* Default: ''

The namespace root at the entry path. All source files are treated as sub-namespaces of this namespace, relative to the `base` path.

##### fileName
* Type: `string`
* Default: 'Component-preload.js'

File name of the combined file to emit.


## Limitations

`.json` and `.html` views are not yet supported. Please open an issue or make a pull request if you need them. Implementation should be fairly easy - just a few LoC in the function `transformSingleFile`.


## License

MIT © [Christian Theilemann](https://github.com/geekflyer)