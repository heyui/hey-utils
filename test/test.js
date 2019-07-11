import utils from '../src/index';
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

  describe('toggleValue', function () {
    it('toggleValue', function () {
      let a = [0, 4];
      utils.toggleValue(a, '0')
      expect(a).to.be.deep.equal([4]);
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
  
  describe('加减乘除', function () {
    it('add', function () {
      expect(utils.add(0.09999999, 0.00000001)).to.be.deep.equal(0.1);
      expect(utils.add(1.14, 1.101)).to.be.deep.equal(2.241);
      expect(utils.add(1.14, -1)).to.be.deep.equal(0.14);
    });
    it('sub', function () {
      expect(utils.sub(-0.09999999, 0.00000001)).to.be.deep.equal(-0.1);
      expect(utils.sub(1.14, 1.101)).to.be.deep.equal(0.039);
      expect(utils.sub(1.14, 1)).to.be.deep.equal(0.14);
    });
    it('mul', function () {
      expect(utils.mul(32.200, 1000)).to.be.deep.equal(32200);
      expect(utils.mul(0.012345, 0.1)).to.be.deep.equal(0.0012345);
    });
    it('div', function () {
      expect(utils.div(193.3, 10)).to.be.deep.equal(19.33);
      expect(utils.div(0.000001, 0.0001)).to.be.deep.equal(0.01);
      expect(utils.div(32209.99, 1000)).to.be.deep.equal(32.20999);
    });
  });

}());