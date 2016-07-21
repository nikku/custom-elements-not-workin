'use strict';

var path = require('path'),
    fs = require('fs');

var basePath = '.';

var absoluteLibPath = path.resolve(path.join(__dirname, basePath, 'lib'));
var absoluteTestPath = path.resolve(path.join(__dirname, basePath, 'test'));

module.exports = function(karma) {

  karma.set({

    basePath: basePath,

    frameworks: [
      'browserify',
      'chai',
      'mocha'
    ],

    files: [
      'test/**/*-spec.js'
    ],

    preprocessors: {
      'test/**/*-spec.js': ['browserify']
    },

    reporters: ['spec'],

    browsers: ['Chrome', 'Firefox', 'PhantomJS'],

    browserNoActivityTimeout: 30000,

    logLevel: karma.LOG_INFO,

    // browserify configuration
    browserify: {
      debug: true,
      paths: [
        absoluteLibPath,
        absoluteTestPath
      ],
      insertGlobalVars: {
        process: function () {
          return 'undefined';
        },
        Buffer: function () {
          return 'undefined';
        }
      },
      transform: [
        [ 'stringify', { global: true, extensions: [ '.bpmn', '.cmmn', '.dmn', '.css', '.html' ] } ]
      ]
    }
  });
};