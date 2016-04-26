var paymentAPI = require('../API/manage/payment-api.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

var authToken = "token123456789";

var testPayment = {
  amount: "500.00",
  authorizationId: "authid12345",
  merchantReferenceId: "merchantrefid12345"
};
var testPayments = [testPayment];

var apiServer = config("properties").apiServer;

test('sendAuthReversal', function(t) {

  var server = nock(apiServer, {
      reqheaders: {
        'Authorization': authToken
      }
    })
    .post('/api/payments/reversals', testPayments)
    .reply(204);

  server;
  paymentAPI.sendAuthReversal(testPayments, function(error, body) {
    server.done();
    expect(error).to.be.a('null');
    expect(body).to.a('null');
  }, authToken);

  t.end();
});

test('sendAuthReversal with failure', function(t) {

  var server = nock(apiServer, {
      reqheaders: {
        'Authorization': authToken
      }
    })
    .post('/api/payments/reversals', testPayments)
    .reply(500);

  server;
  paymentAPI.sendAuthReversal(testPayments, function(error, body) {
    server.done();
    expect(error).to.be.an.instanceof(Error);
    expect(body).to.a('null');
  }, authToken);

  t.end();
});
