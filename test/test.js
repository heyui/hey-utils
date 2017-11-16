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
  
  describe('dictMapping', function () {
    let a = [{ title: '选择0', key: 0 }, { title: '选择1', key: 'a1', other: '其他值' }, { title: '选择2', key: 'a2' }, { title: '选择3', key: 'a3' }];
    it('test1', function () {
      expect(utils.dictMapping({value: 'a1', dict: a, titleField: 'title'})).to.be.deep.equal('选择1');
    });
    it('test2', function () {
      expect(utils.dictMapping({value: ['a1', 'a2'], dict: a, titleField: 'title'})).to.be.deep.equal('选择1, 选择2');
    });
    it('test3', function () {
      expect(utils.dictMapping({value: 'a1|a2', dict: a, titleField: 'title', connector: '|'})).to.be.deep.equal('选择1, 选择2');
    });
  });

}());