var indexRouter = require('../router/index');
var indexRouter = require('../router/routes/home-route');
var indexRouter = require('../router/routes/course-route');
var indexRouter = require('../router/routes/whatsnew-route');
var getRoutemocker = require('../router/param/getroutemocker');

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var test = require('tap').test;

test('Routes test case 1', function(t) {
      var req,res,spy;

      req = res = {};
      spy = res.send = sinon.spy();

      getRoutemocker.getHomepage(req, res);
      expect(spy.calledOnce).to.equal(true);
      t.end();
});
test('Routes test case 2', function(t) {
      req = res = {};
      spy = res.send = sinon.spy();

      getRoutemocker.getWhatsNew(req, res);
      expect(spy.calledOnce).to.equal(true);
      t.end();

});
