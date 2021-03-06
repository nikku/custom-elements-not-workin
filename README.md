# Custom Elements (not working)

An example that verifies that [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) (part of [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)) are actually __not working reliably cross-browser__.

Especially some quirks will never be reliably shimmed (such as the `instanceof` behavior).


### What is not working

* Callbacks are only called asynchronously
* Elements need explicit upgrade after domification
* `e instanceof CustomElement`


### Tests

Checkout [the test suite](https://github.com/nikku/custom-elements-not-workin/blob/master/test/spec/app/web-components-spec.js#L64) for the cases covered.


```
npm test

# or in watch mode
npm run test:watch
```


### Expected Results

* __36 test cases fail in total on PhantomJS and Firefox__
* No test cases fail on Chrome

```
PhantomJS 2.1.1 (...): Executed 40 of 40 (18 FAILED) ...
Chrome 51.0.2704 ...: Executed 40 of 40 SUCCESS ...
Firefox 47.0.0 ...: Executed 40 of 40 (18 FAILED) ...
IE 11.0.0 (Windows 7 0.0.0): Executed 40 of 40 (18 FAILED) ...
```


### Notes

* Custom Elements can be [manually enabled in Firefox](https://stackoverflow.com/questions/25220821/enable-custom-elements-in-firefox). When enabled, all tests pass.
