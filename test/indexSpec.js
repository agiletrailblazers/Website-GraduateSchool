

var homepg=require('../routes/index');
var homepg=require('../routes/users');
var gethomepage = require('../routes/param/gethomepage');

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
});
