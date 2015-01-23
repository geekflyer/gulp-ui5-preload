# gulp-ui5-preload [![Build Status](https://travis-ci.org/geekflyer/gulp-ui5-preload.svg?branch=master)](https://travis-ci.org/geekflyer/gulp-ui5-preload)

Creates a Component-preload.js file for openui5 / sapui5 projects.

## Install

```sh
$ npm install --save-dev gulp-ui5-preload
```

## Usage

The example also shows the common usage of uglifyjs in the pipeline. This is optional.

```js
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var ui5Preload = require('gulp-ui5-preload');

gulp.task('ui5preload', function(){
  return gulp.src([
					'src/ui/**/**.+(js|xml)',
					'!src/ui/**.**'     // exclude files in project root (e.g. Component.js)
                  ])
          .pipe(uglify())
          .pipe(ui5preload({base:'src/ui',namespace:'my.project.ui'}))
          .pipe(gulp.dest('dist'))
     })
```

## API

### ui5Preload(options)

#### options

##### base

Required Parameter
Type: `string`  

The base / entry path of your app. Usually the same location where your index.html and the Component.js resides.

##### namespace
Type: `string`

The namespace root at the entry path. All source files are treated as sub-namespaces of this parameter.

## License

MIT © [Christian Theilemann](https://github.com/geekflyer)
