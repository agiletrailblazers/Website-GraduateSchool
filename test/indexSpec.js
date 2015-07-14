var homepg = require('../routes/index.js');
var homepg = require('../routes/users.js');
var gethomepage = require('../routes/param/gethomepage.js');

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

describe("Routes", function() {
  describe("GET Homepage", function() {
    it("should respond", function() {
      var req,res,spy;

      req = res = {};
      spy = res.send = sinon.spy();

      gethomepage(req, res);
      expect(spy.calledOnce).to.equal(true);
    });
  });
  describe("GET What's New", function() {
    it("should respond", function() {
      var req,res,spy;

      req = res = {};
      spy = res.send = sinon.spy();

      gethomepage(req, res);
      expect(spy.calledOnce).to.equal(true);
    })
  });
});
