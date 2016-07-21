'use strict';

var nextTick = require('next-tick');

var shim;

/**
 * Call callback once web components are ready.
 *
 * @param {Function} done
 */
module.exports = function componentsReady(done) {

  if (typeof shim !== 'undefined') {
    return nextTick(done);
  }

  // v0 shim
  if ('registerElement' in document) {
    shim = false;

    return nextTick(done);
  }

  window.addEventListener('WebComponentsReady', function() {
    shim = true;

    done();
  });

  require('../shim/custom-elements');
};


module.exports.init = function init(element) {
  if (typeof shim === 'undefined') {
    throw new Error('components not ready');
  }

  if (shim) {
    /* global CustomElements */
    return CustomElements.upgrade(element, false);
  }
};