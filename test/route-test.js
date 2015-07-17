var indexRouter = require('../router/index');
var indexRouter = require('../router/routes/home-route');
var indexRouter = require('../router/routes/course-route');
var indexRouter = require('../router/routes/whatsnew-route');
var getRoutemocker = require('../router/param/getroutemocker');

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

describe("Routes", function() {
  describe("GET Homepage", function() {
    it("test home page", function() {
      var req,res,spy;

      req = res = {};
      spy = res.send = sinon.spy();

      getRoutemocker.getHomepage(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
  });
  describe("GET What's New Page", function() {
    it("tests what's new page", function() {
      var req,res,spy;

      req = res = {};
      spy = res.send = sinon.spy();

      getRoutemocker.getWhatsNew(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
  });
});
