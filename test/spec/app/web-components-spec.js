'use strict';

var componentsReady = require('util/components-ready');

var slice = function(arr) {
  return Array.prototype.slice.call(arr);
};

var domify = require('domify');

var $ = require('jquery');


var Element1;

var TEST_MARKUP = '<test-element1 id="xxx" class="bar" foo-bar="XXX"></test-element1>';

describe.only('web-components', function() {

  before(componentsReady);

  before(function() {
    Element1 = createType();
  });


  describe('should instantiate', function() {

    it('via JavaScript', function() {

      // when
      var element1 = new Element1();

      // then
      expect(element1).to.be.an.instanceof(Element1);
    });


    describe('via domify', elementTests(function() {
      return domify(TEST_MARKUP);
    }));


    describe('via jquery', elementTests(function() {
      return $(TEST_MARKUP).get(0);
    }));


    describe('via subtree select / domify', elementTests(function() {
      var nestedMarkup = '<div>' + TEST_MARKUP + TEST_MARKUP + '</div>';

      return componentsDomify(nestedMarkup).querySelector('test-element1');
    }));

  });

});




////////// helpers ///////////////////////////////

function elementTests(createElement) {

  return function() {

    var element1;

    beforeEach(function() {
      element1 = createElement();
    });


    it('instanceof Element1', function() {
      expect(element1).to.be.an.instanceof(Element1);
    });


    it('with id', function() {
      expect(element1.id).to.eql('xxx');
    });


    it('with class', function() {
      expect(slice(element1.classList)).to.contain('bar');
    });


    it('with custom attribute', function() {
      expect(element1.getAttribute('foo-bar')).to.eql('XXX');
    });


    describe('callbacks', function() {

      it('createdCallback', function() {
        expect(element1._created).to.be.true;
      });


      it('createdCallback when initialized', function() {
        // when
        componentsReady.init(element1);

        // then
        expect(element1._created).to.be.true;
      });


      it('attachedCallback (sync)', function() {

        // when
        document.body.appendChild(element1);

        // then
        expect(element1._attached).to.be.true;
      });


      it('attachedCallback (async)', function(done) {

        // when
        document.body.appendChild(element1);

        delay(function() {
          // then
          expect(element1._attached).to.be.true;

          done();
        });
      });


      it('detachedCallback (sync)', function() {

        // given
        document.body.appendChild(element1);

        // when
        document.body.removeChild(element1);

        // then
        expect(element1._attached).to.be.false;
      });


      it('detachedCallback (async)', function(done) {

        // given
        document.body.appendChild(element1);

        delay(function() {

          // when
          document.body.removeChild(element1);

          delay(function() {

            // then
            expect(element1._attached).to.be.false;

            done();
          });

        });
      });


      it('attributeChangedCallback (sync)', function() {

        // when
        element1.setAttribute('observed', '2');

        // then
        expect(element1._attrChanges).to.eql([
          [ 'observed', null, '2' ]
        ]);
      });


      it('attributeChangedCallback (async)', function(done) {

        // when
        element1.setAttribute('observed', '2');

        delay(function() {
          // then
          expect(element1._attrChanges).to.eql([
            [ 'observed', null, '2' ]
          ]);

          done();
        });
      });


      it('attributeChangedCallback (attached, async)', function(done) {

        // given
        document.body.appendChild(element1);

        delay(function() {

          // when
          element1.setAttribute('observed', '2');

          delay(function() {

            // then
            expect(element1._attrChanges).to.eql([
              [ 'observed', null, '2' ]
            ]);

            done();
          });

        });
      });

    });

  };

}


function createType() {

  var Element1Prototype = Object.create(HTMLElement.prototype);

  Element1Prototype.createdCallback = function() {
    this._created = true;
    this._attrChanges = [];
  };

  Element1Prototype.attachedCallback = function() {
    this._attached = true;
  };
  Element1Prototype.detachedCallback = function() {
    this._attached = false;
  };
  Element1Prototype.attributeChangedCallback = function(attr, oldVal, newVal) {
    this._attrChanges.push([ attr, oldVal, newVal ]);
  };
  Element1Prototype.observableAttributes = [
    'observed'
  ];

  // v0
  if (true) {
    return document.registerElement('test-element1', {
      prototype: Element1Prototype
    });
  }

  // v1, latest shit; does not work in shims, nor in latest Chrome
  if (false) {
    Element1 = function() {
      HTMLElement.call(this);
    };

    Element1.prototype = Element1Prototype;

    customElements.define('test-element1', Element1);
  }
}


function delay(fn) {
  return setTimeout(fn, 300);
}

function componentsDomify(str) {

  var el = domify(str);

  componentsReady.init(el);

  return el;
}