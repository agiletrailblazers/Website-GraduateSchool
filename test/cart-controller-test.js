var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
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

test('completePayment', function(t) {

  var res = {};
  var expCourseId = "course12345";
  var expSessionId = "session12345";
  var expUserId = "person12345";
  var amount = "100.00";
  var authId = "authid12345";
  var referenceNumber = "refnumber12345";
  var authorization = {
    amount: amount,
    authId: authId,
    referenceNumber: referenceNumber
  };

  var sessionData = {
    userId: expUserId,
    cart: {
      courseId : expCourseId,
      sessionId : expSessionId,
      payment : {
        authorization : authorization
      }
    }
  };
  var req = {
    query : {
      authToken : "123456789123456789"
    }
  };
  var course  = {
    id : expCourseId
  };
  var courseSession  = {
    classNumber : expSessionId,
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
  var registrationResult = {
    paymentAcceptedError: false,
    paymentDeclinedError: false,
    generalError: false,
    registrationResponse : {
      registrations : [
        {
          id : "regid12345"
        }
      ]

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
            // state of the session data will be verified later in test
            // as it may change as a result of multiple calls
          }
        },
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(req.query.authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(req.query.authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {
          registerUser: function (userId, registrationRequest, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(req.query.authToken);
            expect(registrationRequest.registrations[0].orderNumber).to.be.an('null');
            expect(registrationRequest.registrations[0].studentId).to.eql(expUserId);
            expect(registrationRequest.registrations[0].sessionId).to.eql(expSessionId);
            expect(registrationRequest.payments[0].amount).to.eql(amount);
            expect(registrationRequest.payments[0].authorizationId).to.eql(authId);
            expect(registrationRequest.payments[0].merchantReferenceId).to.eql(referenceNumber);
            cb(null, registrationResult);
          }
        }
      });

  res.render = function(page, content) {
    expect(page).to.eql('manage/cart/receipt');
    expect(content.title).to.eql('Course Registration - Receipt');
    expect(content.course).to.eql(course);
    expect(content.session).to.eql(courseSession);
    expect(content.registrations).to.eql(registrationResult.registrationResponse.registrations);
    expect(content.payment).to.eql(authorization);

    // verify that the cart in the session data has been cleared out after successful registration
    should.exist(sessionData.userId);
    should.not.exist(sessionData.cart.sessionId);
    should.not.exist(sessionData.cart.courseId);
    should.not.exist(sessionData.cart.payment);
  };

  controller.completePayment(req, res, null);

  t.end();
});

test('completePayment with payment declined', function(t) {

  var res = {};
  var expCourseId = "course12345";
  var expSessionId = "session12345";
  var expUserId = "person12345";
  var amount = "100.00";
  var authId = "authid12345";
  var referenceNumber = "refnumber12345";
  var authorization = {
    amount: amount,
    authId: authId,
    referenceNumber: referenceNumber
  };

  var sessionData = {
    userId: expUserId,
    cart: {
      courseId : expCourseId,
      sessionId : expSessionId,
      payment : {
        authorization : authorization
      }
    }
  };
  var req = {
    query : {
      authToken : "123456789123456789"
    }
  };
  var course  = {
    id : expCourseId
  };
  var courseSession  = {
    classNumber : expSessionId,
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
  var registrationResult = {
    paymentAcceptedError: false,
    paymentDeclinedError: true,
    generalError: false,
    registrationResponse : {
      registrations : [
        {
          id : "regid12345"
        }
      ]

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
            // state of the session data will be verified later in test
            // as it may change as a result of multiple calls
          }
        },
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(req.query.authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(req.query.authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {
          registerUser: function (userId, registrationRequest, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(req.query.authToken);
            expect(registrationRequest.registrations[0].orderNumber).to.be.an('null');
            expect(registrationRequest.registrations[0].studentId).to.eql(expUserId);
            expect(registrationRequest.registrations[0].sessionId).to.eql(expSessionId);
            expect(registrationRequest.payments[0].amount).to.eql(amount);
            expect(registrationRequest.payments[0].authorizationId).to.eql(authId);
            expect(registrationRequest.payments[0].merchantReferenceId).to.eql(referenceNumber);
            cb(null, registrationResult);
          }
        }
      });

  res.render = function(page, content) {
    expect(page).to.eql('manage/cart/confirmation');
    expect(content.title).to.eql('Course Registration - Confirmation');
    expect(content.course).to.eql(course);
    expect(content.session).to.eql(courseSession);
    expect(content.authorization).to.eql(authorization);
    expect(content.error).to.eql("We're sorry, but your payment could not be processed. Please contact your financial institution if you feel this was in error.");

    // verify that the authorization cart in the session data has been cleared out after successful registration
    should.exist(sessionData.userId);
    should.exist(sessionData.cart.sessionId);
    should.exist(sessionData.cart.courseId);
    should.not.exist(sessionData.cart.payment.authorization);
  };

  controller.completePayment(req, res, null);

  t.end();
});

test('completePayment with payment accepted', function(t) {

  var res = {};
  var expCourseId = "course12345";
  var expSessionId = "session12345";
  var expUserId = "person12345";
  var amount = "100.00";
  var authId = "authid12345";
  var referenceNumber = "refnumber12345";
  var authorization = {
    amount: amount,
    authId: authId,
    referenceNumber: referenceNumber
  };

  var sessionData = {
    userId: expUserId,
    cart: {
      courseId : expCourseId,
      sessionId : expSessionId,
      payment : {
        authorization : authorization
      }
    }
  };
  var req = {
    query : {
      authToken : "123456789123456789"
    }
  };
  var course  = {
    id : expCourseId
  };
  var courseSession  = {
    classNumber : expSessionId,
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
  var registrationResult = {
    paymentAcceptedError: true,
    paymentDeclinedError: false,
    generalError: false,
    registrationResponse : {
      registrations : [
        {
          id : "regid12345"
        }
      ]

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
            // state of the session data will be verified later in test
            // as it may change as a result of multiple calls
          }
        },
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(req.query.authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(req.query.authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {
          registerUser: function (userId, registrationRequest, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(req.query.authToken);
            expect(registrationRequest.registrations[0].orderNumber).to.be.an('null');
            expect(registrationRequest.registrations[0].studentId).to.eql(expUserId);
            expect(registrationRequest.registrations[0].sessionId).to.eql(expSessionId);
            expect(registrationRequest.payments[0].amount).to.eql(amount);
            expect(registrationRequest.payments[0].authorizationId).to.eql(authId);
            expect(registrationRequest.payments[0].merchantReferenceId).to.eql(referenceNumber);
            cb(null, registrationResult);
          }
        }
      });

  res.render = function(page, content) {
    expect(page).to.eql('manage/cart/confirmation');
    expect(content.title).to.eql('Course Registration - Confirmation');
    expect(content.course).to.eql(course);
    expect(content.session).to.eql(courseSession);
    expect(content.authorization).to.eql(authorization);
    expect(content.error).to.eql("We're sorry, but we've encountered an issue while processing your registration request. To finalize your registration, please contact our Customer Service Center at (888) 744-4723 .");

    // verify that the authorization cart in the session data has been cleared out after successful registration
    should.exist(sessionData.userId);
    should.exist(sessionData.cart.sessionId);
    should.exist(sessionData.cart.courseId);
    should.not.exist(sessionData.cart.payment.authorization);
  };

  controller.completePayment(req, res, null);

  t.end();
});

test('completePayment with general error', function(t) {

  var res = {};
  var expCourseId = "course12345";
  var expSessionId = "session12345";
  var expUserId = "person12345";
  var amount = "100.00";
  var authId = "authid12345";
  var referenceNumber = "refnumber12345";
  var authorization = {
    amount: amount,
    authId: authId,
    referenceNumber: referenceNumber
  };

  var sessionData = {
    userId: expUserId,
    cart: {
      courseId : expCourseId,
      sessionId : expSessionId,
      payment : {
        authorization : authorization
      }
    }
  };
  var req = {
    query : {
      authToken : "123456789123456789"
    }
  };
  var course  = {
    id : expCourseId
  };
  var courseSession  = {
    classNumber : expSessionId,
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
  var registrationResult = {
    paymentAcceptedError: false,
    paymentDeclinedError: false,
    generalError: true,
    registrationResponse : {
      registrations : [
        {
          id : "regid12345"
        }
      ]

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
            // state of the session data will be verified later in test
            // as it may change as a result of multiple calls
          }
        },
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(req.query.authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(req.query.authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {
          registerUser: function (userId, registrationRequest, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(req.query.authToken);
            expect(registrationRequest.registrations[0].orderNumber).to.be.an('null');
            expect(registrationRequest.registrations[0].studentId).to.eql(expUserId);
            expect(registrationRequest.registrations[0].sessionId).to.eql(expSessionId);
            expect(registrationRequest.payments[0].amount).to.eql(amount);
            expect(registrationRequest.payments[0].authorizationId).to.eql(authId);
            expect(registrationRequest.payments[0].merchantReferenceId).to.eql(referenceNumber);
            cb(null, registrationResult);
          }
        },
        "../../../helpers/common.js": {
          redirectToError: function (response) {
            expect(response).to.eql(res);

            // verify that the authorization cart in the session data has been cleared out after successful registration
            should.exist(sessionData.userId);
            should.exist(sessionData.cart.sessionId);
            should.exist(sessionData.cart.courseId);
            should.not.exist(sessionData.cart.payment.authorization);
          },
          isNotEmpty: function (endDate) {
            return true;
          }
        }

      });

  controller.completePayment(req, res, null);

  t.end();
});
