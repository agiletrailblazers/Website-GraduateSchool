var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire').noCallThru();

test('displayCart', function(t) {

  var res = {};
  var sessionData = {};
  var req = {
    query : {
      authToken : "123456789123456789",
      courseId : "course12345",
      sessionId : "session12345"
    }
  };
  var course  = {
    id : req.query.courseId
  };
  var courseSession  = {
    classNumber : "600354",
    startDate : {
      date : function(format) {
        expect(format).to.eql('MMM DD, YYYY');
        return "Aug 08, 2016"
      }
    },
    endDate : {
      date : function(format) {
        expect(format).to.eql('MMM DD, YYYY');
        return "Aug 08, 2016"
      }
    }
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
  {
    "../../../API/manage/session-api.js": {
      getSessionData: function (req) {
        return sessionData;
      },
      setSessionData: function (res, data) {
        // verify data passed in
        expect(data.cart.courseId).to.eql(req.query.courseId);
        expect(data.cart.sessionId).to.eql(req.query.sessionId);
      }
    },
    "../../../API/course.js": {
      performExactCourseSearch: function (cb, courseId, authToken) {
        expect(authToken).to.eql(req.query.authToken);
        expect(courseId).to.eql(req.query.courseId);
        cb(null, null, course);
      },
      getSession: function (sessionId, cb, authToken) {
        expect(authToken).to.eql(req.query.authToken);
        expect(sessionId).to.eql(req.query.sessionId);
        cb(null, courseSession);
      }
    }
   });

  res.render = function(page, content) {
      expect(page).to.eql('manage/cart/cart');
      expect(content.title).to.eql('Course Registration');
      expect(content.course).to.eql(course);
      expect(content.session).to.eql(courseSession);
      expect(content.nextpage).to.eql("/manage/user/loginCreate");
  };

  controller.displayCart(req, res, null);

  t.end();
});

test('displayCart handles authenticated user', function(t) {

  // placeholder for real test

  t.end();
});

test('displayCart handles get course error', function(t) {

  // placeholder for real test
  t.end();
});

test('cancelPayment from CyberSource page', function(t) {

  var req = {}, res = {};
  var sessionId = "sesssion12345";
  var sessionData = {
    cart : {
      sessionId: sessionId,
      payment: {
        amount: "500.00"
      }
    }
  };

  res.redirect = function(page) {
    expect(page).to.eql('/manage/cart');
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/manage/session-api.js": {
          getSessionData: function (req) {
            return sessionData;
          },
          setSessionData: function (res, data) {
            // verify data passed in
            // make sure cart contents not removed
            expect(data.cart.sessionId).to.eql(sessionId);
            // make sure that the payment info was cleared from session data
            expect(data.cart.payment).to.eql({});
          }
        },
        "../../../API/manage/payment-api.js": {
          // this api should not be called since no authorization data in session
          // no functions mocked, so test will fail if attempt is made to call this api
        }
      });

  controller.cancelPayment(req, res, null);

  t.end();
});

test('cancelPayment from confirmation page', function(t) {

  var res = {};
  var req = {
    query : {
      authToken : "123456789123456789"
    }
  };
  var sessionId = "sesssion12345";
  var sessionData = {
    cart : {
        sessionId: sessionId,
        payment: {
          amount: "500.00",
          authorization : {
            amount: "500.00",
            authId: "authid12345",
            referenceNumber: "ref12345"
          }
      }
    }
  };

  res.redirect = function(page) {
    expect(page).to.eql('/manage/cart');
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/manage/session-api.js": {
          getSessionData: function (req) {
            return sessionData;
          },
          setSessionData: function (res, data) {
            // verify data passed in
            // make sure cart contents not removed
            expect(data.cart.sessionId).to.eql(sessionId);
            // make sure that the payment info was cleared from session data
            expect(data.cart.payment).to.eql({});
          }
        },
        "../../../API/manage/payment-api.js": {
          sendAuthReversal: function (payments, cb, authToken) {
            expect(authToken).to.eql(req.query.authToken);
            expect(payments[0].amount).to.eql(sessionData.cart.payment.authorization.amount);
            expect(payments[0].authorizationId).to.eql(sessionData.cart.payment.authorization.authId);
            expect(payments[0].merchantReferenceId).to.eql(sessionData.cart.payment.authorization.referenceNumber);
            cb(null);
          }
        }
      });

  controller.cancelPayment(req, res, null);

  t.end();
});

test('cancelPayment from confirmation page with api failure', function(t) {

  var res = {};
  var req = {
    query : {
      authToken : "123456789123456789"
    }
  };
  var sessionId = "sesssion12345";
  var sessionData = {
    cart : {
        sessionId: sessionId,
        payment: {
          amount: "500.00",
          authorization : {
            amount: "500.00",
            authId: "authid12345",
            referenceNumber: "ref12345"
          }
      }
    }
  };

  res.redirect = function(page) {
    expect(page).to.eql('/manage/cart');
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/manage/session-api.js": {
          getSessionData: function (req) {
            return sessionData;
          },
          setSessionData: function (res, data) {
            // verify data passed in
            // make sure cart contents not removed
            expect(data.cart.sessionId).to.eql(sessionId);
            // make sure that the payment info was cleared from session data
            expect(data.cart.payment).to.eql({});
          }
        },
        "../../../API/manage/payment-api.js": {
          sendAuthReversal: function (payments, cb, authToken) {
            expect(authToken).to.eql(req.query.authToken);
            expect(payments[0].amount).to.eql(sessionData.cart.payment.authorization.amount);
            expect(payments[0].authorizationId).to.eql(sessionData.cart.payment.authorization.authId);
            expect(payments[0].merchantReferenceId).to.eql(sessionData.cart.payment.authorization.referenceNumber);
            cb(new Error("I made the test fail"));
          }
        }
      });

  controller.cancelPayment(req, res, null);

  t.end();
});
