var utils = require('../src/index');
var expect = require('chai').expect;
(function () {
  'use strict';

  describe('extend', function () {
    it('extend', function () {
      let a = {c:1}
      let r = utils.extend({a: a}, {a: a, b: a});
      let d = new Date();
      expect(r).to.be.deep.equal({
        a: {c:1},
        b: {c:1}
      });
    });
  });

}());