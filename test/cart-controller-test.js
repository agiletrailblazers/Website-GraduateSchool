var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var proxyquire = require('proxyquire').noCallThru();

var contentfulCourseInfo = {
  sessionTable : ["SessionTitle1", "SessionTitle2", "SessionTitle3", "SessionTitle4"],
  courseDetailTitles: ["CourseTitle1", "CourseTitle2", "CourseTitle3", "CourseTitle4"]
};

var authToken = "123456789123456789";

test('displayCart', function(t) {

  var res = {};
  var sessionData = { authToken : authToken};
  var req = {
    query : {
      courseId : "course12345",
      sessionId : "session12345"
    },
    session : {
      sessionData : sessionData
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
    "../../../API/course.js": {
      performExactCourseSearch: function (cb, courseId, authToken) {
        expect(authToken).to.eql(authToken);
        expect(courseId).to.eql(req.query.courseId);
        cb(null, null, course);
      },
      getSession: function (sessionId, cb, authToken) {
        expect(authToken).to.eql(authToken);
        expect(sessionId).to.eql(req.query.sessionId);
        cb(null, courseSession);
      }
    },
    "../../../API/contentful.js": {
      getCourseDetails: function(cb) {
        cb(contentfulCourseInfo, null);
      }
    }
   });

  res.render = function(page, content) {
      expect(page).to.eql('manage/cart/cart');
      expect(content.title).to.eql('Course Registration');
      expect(content.course).to.eql(course);
      expect(content.session).to.eql(courseSession);
      expect(content.nextpage).to.eql("/manage/user/registration_login_create");
      expect(content.contentfulCourseInfo).to.eql(contentfulCourseInfo);
      expect(content.error).to.eql(null);
  };

  controller.displayCart(req, res, null);

  expect(req.session.sessionData.cart.courseId).to.eql(req.query.courseId);
  expect(req.session.sessionData.cart.sessionId).to.eql(req.query.sessionId);

  t.end();
});

test('displayCart with already registered error ', function(t) {
  var expectedRegExistsError = 'User already registered for session';
  var res = {};
  var sessionData = {
    authToken : authToken,
    cart : {
      error: expectedRegExistsError
      }
  };
  var req = {
    query : {
      courseId : "course12345",
      sessionId : "session12345"
    },
    session : {
      sessionData : sessionData
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
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(req.query.courseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(req.query.sessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/contentful.js": {
          getCourseDetails: function(cb) {
            cb(contentfulCourseInfo, null);
          }
        }
      });

  res.render = function(page, content) {
    expect(page).to.eql('manage/cart/cart');
    expect(content.title).to.eql('Course Registration');
    expect(content.course).to.eql(course);
    expect(content.session).to.eql(courseSession);
    expect(content.nextpage).to.eql("/manage/user/registration_login_create");
    expect(content.error).to.eql(expectedRegExistsError);
  };

  controller.displayCart(req, res, null);

  expect(req.session.sessionData.cart.courseId).to.eql(req.query.courseId);
  expect(req.session.sessionData.cart.sessionId).to.eql(req.query.sessionId);
  expect(req.session.sessionData.cart.error).to.eql(null);

  t.end();
});

test('displayCart handles get contentful error', function(t) {

  var res = {};
  var sessionData = { authToken : authToken};
  var req = {
    query : {
      courseId : "course12345",
      sessionId : "session12345"
    },
    session : {
      sessionData : sessionData
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
  var expectedError = new Error("Intentional Test Error");

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../helpers/common.js": {
          redirectToError: function (response) {
            expect(response).to.eql(res);
          },
          isNotEmpty: function (endDate) {
            return true;
          }
        },
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(req.query.courseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(req.query.sessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/contentful.js": {
          getCourseDetails: function(cb) {
            cb(null, expectedError);
          }
        }
      });

  controller.displayCart(req, res, null);

  t.end();
});

test('cancelPayment from CyberSource page', function(t) {
  var sessionId = "sesssion12345";
  var sessionData = {
    cart : {
      sessionId: sessionId,
      payment: {
        amount: "500.00"
      }
    }
  };
  var req = {
    session : {
      sessionData : sessionData
    }
  };

  var res = {};
  res.redirect = function(page) {
    expect(page).to.eql('/manage/cart');
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/manage/payment-api.js": {
          // this api should not be called since no authorization data in session
          // no functions mocked, so test will fail if attempt is made to call this api
        }
      });

  controller.cancelPayment(req, res, null);

  expect(req.session.sessionData.cart.sessionId).to.eql(sessionId);
  // make sure that the payment info was cleared from session data
  expect(req.session.sessionData.cart.payment).to.eql({});

  t.end();
});

test('cancelPayment from confirmation page', function(t) {

  var res = {};
  res.redirect = function(page) {
    expect(page).to.eql('/manage/cart');
  };

  var sessionId = "sesssion12345";
  var sessionData = {
    cart : {
        authToken : authToken,
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
  var req = {
    session : {
      sessionData : sessionData
    }
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/manage/payment-api.js": {
          sendAuthReversal: function (payments, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(payments[0].amount).to.eql(sessionData.cart.payment.authorization.amount);
            expect(payments[0].authorizationId).to.eql(sessionData.cart.payment.authorization.authId);
            expect(payments[0].merchantReferenceId).to.eql(sessionData.cart.payment.authorization.referenceNumber);
            cb(null);
          }
        }
      });

  controller.cancelPayment(req, res, null);

  expect(req.session.sessionData.cart.sessionId).to.eql(sessionId);
  // make sure that the payment info was cleared from session data
  expect(req.session.sessionData.cart.payment).to.eql({});

  t.end();
});

test('cancelPayment from confirmation page with api failure', function(t) {
  var sessionId = "sesssion12345";
  var sessionData = {
    cart : {
      authToken : authToken,
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

  var res = {};
  var req = {
    session : {
      sessionData : sessionData
    }
  };

  res.redirect = function(page) {
    expect(page).to.eql('/manage/cart');
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/manage/payment-api.js": {
          sendAuthReversal: function (payments, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(payments[0].amount).to.eql(sessionData.cart.payment.authorization.amount);
            expect(payments[0].authorizationId).to.eql(sessionData.cart.payment.authorization.authId);
            expect(payments[0].merchantReferenceId).to.eql(sessionData.cart.payment.authorization.referenceNumber);
            cb(new Error("I made the test fail"));
          }
        }
      });

  controller.cancelPayment(req, res, null);

  // make sure cart contents not removed
  expect(req.session.sessionData.cart.sessionId).to.eql(sessionId);
  // make sure that the payment info was cleared from session data
  expect(req.session.sessionData.cart.payment).to.eql({});

  t.end();
});

test('confirmPayment', function(t) {

  var res = {};
  var expCourseId = "course12345";
  var expSessionId = "session12345";
  var expUserId = "person12345";

  var sessionData = {
    authToken : authToken,
    userId: expUserId,
    cart: {
      courseId : expCourseId,
      sessionId : expSessionId,
      payment : {
      }
    }
  };
  var req = {
    body : {
      signed_field_names : "field1,field2",
      field1 : "value1",
      field2 : "value2",
      decision : "ACCEPT",
      reason_code : "100",
      req_card_number : "xxxx5555",
      req_card_expiry_date : "04/2018",
      transaction_id : "txn12345",
      auth_amount : "100.00",
      req_reference_number : "ref12345",
      signature : "IAmTheRealDeal"
    },
    session : {
      sessionData : sessionData
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

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {},
        "crypto-js" : {
          HmacSHA256: function (sigStr, secretKey) {
            expect(sigStr).to.eql("field1=value1,field2=value2");
            expect(secretKey).to.eql("fakeSecretKey");
            return "IAmAnEncryptedString";
          },
          enc : {
            Base64 : {
              stringify : function (hash) {
                expect(hash).to.eql("IAmAnEncryptedString");
                return req.body.signature;
              }
            }
          }
        },
        "konphyg": function(configPath) {
          var configFile = function(configName) {
            expect(configName).to.eql("properties")
            var config =
            {
              manage : {
                payment: {
                  "url" : "some.payment.url",
                  "profileId" : "fakeProfileId",
                  "accessKey" : "fakeAccessKey",
                  "secretKey" : "fakeSecretKey",
                  "declinedReasonCodes" : ["777", "666"],
                  "errorReasonCodes" : ["151", "152"]
                }
              }
            }
            return config;
          };
          return configFile;
        },
        "../../../API/contentful.js": {
          getCourseDetails: function(cb) {
            cb(contentfulCourseInfo, null);
          }
        }
      });

  res.render = function(page, content) {
    expect(page).to.eql('manage/cart/confirmation');
    expect(content.title).to.eql('Course Registration - Payment Review');
    expect(content.course).to.eql(course);
    expect(content.session).to.eql(courseSession);
    expect(content.authorization.approved).to.eql(true);
    expect(content.authorization.reasonCode).to.eql(req.body.reason_code);
    expect(content.authorization.cardNumber).to.eql(req.body.req_card_number);
    expect(content.authorization.cardExpiry).to.eql(req.body.req_card_expiry_date);
    expect(content.authorization.authId).to.eql(req.body.transaction_id);
    expect(content.authorization.amount).to.eql(req.body.auth_amount);
    expect(content.authorization.referenceNumber).to.eql(req.body.req_reference_number);
    expect(content.contentfulCourseInfo).to.eql(contentfulCourseInfo);

    // verify that the cart in the session data has been cleared out after successful registration
    should.exist(sessionData.userId);
    should.exist(sessionData.cart.sessionId);
    should.exist(sessionData.cart.courseId);
    should.exist(sessionData.cart.payment);
    should.exist(sessionData.cart.payment.authorization);
  };

  controller.confirmPayment(req, res, null);

  t.end();
});

test('confirmPayment handles signature mismatch', function(t) {

  var res = {};
  var expCourseId = "course12345";
  var expSessionId = "session12345";
  var expUserId = "person12345";

  var sessionData = {
    authToken : authToken,
    userId: expUserId,
    cart: {
      courseId : expCourseId,
      sessionId : expSessionId,
      payment : {
      }
    }
  };
  var req = {
    body : {
      signed_field_names : "field1,field2",
      field1 : "value1",
      field2 : "value2",
      decision : "ACCEPT",
      reason_code : "100",
      req_card_number : "xxxx5555",
      req_card_expiry_date : "04/2018",
      transaction_id : "txn12345",
      auth_amount : "100.00",
      req_reference_number : "ref12345",
      signature : "IAmTheRealDeal"
    },
    session : {
      sessionData : sessionData
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

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {},
        "crypto-js" : {
          HmacSHA256: function (sigStr, secretKey) {
            expect(sigStr).to.eql("field1=value1,field2=value2");
            expect(secretKey).to.eql("fakeSecretKey");
            return "IAmAnEncryptedString";
          },
          enc : {
            Base64 : {
              stringify : function (hash) {
                expect(hash).to.eql("IAmAnEncryptedString");
                return "IAmAPhony";
              }
            }
          }
        },
        "konphyg": function(configPath) {
          var configFile = function(configName) {
            expect(configName).to.eql("properties")
            var config =
            {
              manage : {
                payment: {
                  "url" : "some.payment.url",
                  "profileId" : "fakeProfileId",
                  "accessKey" : "fakeAccessKey",
                  "secretKey" : "fakeSecretKey",
                  "declinedReasonCodes" : ["777", "666"],
                  "errorReasonCodes" : ["151", "152"]
                }
              }
            }
            return config;
          };
          return configFile;
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
        },
        "../../../API/contentful.js": {
          getCourseDetails: function(cb) {
            cb(contentfulCourseInfo, null);
          }
        }

      });

  controller.confirmPayment(req, res, null);

  t.end();
});

test('confirmPayment handles declined reason code', function(t) {

  var res = {};
  var expCourseId = "course12345";
  var expSessionId = "session12345";
  var expUserId = "person12345";
  var declinedReasonCode = "666";

  var sessionData = {
    authToken : authToken,
    userId: expUserId,
    cart: {
      courseId : expCourseId,
      sessionId : expSessionId,
      payment : {
      }
    }
  };
  var req = {
    body : {
      signed_field_names : "field1,field2",
      field1 : "value1",
      field2 : "value2",
      decision : "REVIEW",
      reason_code : declinedReasonCode,
      req_card_number : "xxxx5555",
      req_card_expiry_date : "04/2018",
      transaction_id : "txn12345",
      auth_amount : "100.00",
      req_reference_number : "ref12345",
      signature : "IAmTheRealDeal"
    },
    session : {
      sessionData : sessionData
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

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {},
        "crypto-js" : {
          HmacSHA256: function (sigStr, secretKey) {
            expect(sigStr).to.eql("field1=value1,field2=value2");
            expect(secretKey).to.eql("fakeSecretKey");
            return "IAmAnEncryptedString";
          },
          enc : {
            Base64 : {
              stringify : function (hash) {
                expect(hash).to.eql("IAmAnEncryptedString");
                return req.body.signature;
              }
            }
          }
        },
        "konphyg": function(configPath) {
          var configFile = function(configName) {
            expect(configName).to.eql("properties")
            var config =
            {
              manage : {
                payment: {
                  "url" : "some.payment.url",
                  "profileId" : "fakeProfileId",
                  "accessKey" : "fakeAccessKey",
                  "secretKey" : "fakeSecretKey",
                  "declinedReasonCodes" : ["777", declinedReasonCode],
                  "errorReasonCodes" : ["151", "152"]
                }
              }
            }
            return config;
          };
          return configFile;
        },
        "../../../API/contentful.js": {
          getCourseDetails: function(cb) {
            cb(contentfulCourseInfo, null);
          }
        }
      });

  res.redirect = function(page) {
    expect(page).to.eql('/manage/cart');

    // verify that the cart in the session data has been cleared out after successful registration
    should.exist(sessionData.userId);
    should.exist(sessionData.cart.sessionId);
    should.exist(sessionData.cart.courseId);
    should.exist(sessionData.cart.payment);
    should.not.exist(sessionData.cart.payment.authorization);
    expect(sessionData.cart.error).to.eql("We're sorry, but your payment could not be processed. Please try another payment method or contact your financial institution if you feel this was in error.");
  };

  controller.confirmPayment(req, res, null);

  t.end();
});

test('confirmPayment handles error reason code', function(t) {

  var res = {};
  var expCourseId = "course12345";
  var expSessionId = "session12345";
  var expUserId = "person12345";
  var errorReasonCode = "152";

  var sessionData = {
    authToken : authToken,
    userId: expUserId,
    cart: {
      courseId : expCourseId,
      sessionId : expSessionId,
      payment : {
      }
    }
  };
  var req = {
    body : {
      signed_field_names : "field1,field2",
      field1 : "value1",
      field2 : "value2",
      decision : "REVIEW",
      reason_code : errorReasonCode,
      req_card_number : "xxxx5555",
      req_card_expiry_date : "04/2018",
      transaction_id : "txn12345",
      auth_amount : "100.00",
      req_reference_number : "ref12345",
      signature : "IAmTheRealDeal"
    },
    session : {
      sessionData : sessionData
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

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {},
        "crypto-js" : {
          HmacSHA256: function (sigStr, secretKey) {
            expect(sigStr).to.eql("field1=value1,field2=value2");
            expect(secretKey).to.eql("fakeSecretKey");
            return "IAmAnEncryptedString";
          },
          enc : {
            Base64 : {
              stringify : function (hash) {
                expect(hash).to.eql("IAmAnEncryptedString");
                return req.body.signature;
              }
            }
          }
        },
        "konphyg": function(configPath) {
          var configFile = function(configName) {
            expect(configName).to.eql("properties")
            var config =
            {
              manage : {
                payment: {
                  "url" : "some.payment.url",
                  "profileId" : "fakeProfileId",
                  "accessKey" : "fakeAccessKey",
                  "secretKey" : "fakeSecretKey",
                  "declinedReasonCodes" : ["777", "666"],
                  "errorReasonCodes" : ["151", errorReasonCode]
                }
              }
            }
            return config;
          };
          return configFile;
        },
        "../../../API/contentful.js": {
          getCourseDetails: function(cb) {
            cb(contentfulCourseInfo, null);
          }
        }
      });

  res.redirect = function(page) {
    expect(page).to.eql('/manage/cart');

    // verify that the cart in the session data has been cleared out after successful registration
    should.exist(sessionData.userId);
    should.exist(sessionData.cart.sessionId);
    should.exist(sessionData.cart.courseId);
    should.exist(sessionData.cart.payment);
    should.not.exist(sessionData.cart.payment.authorization);
    expect(sessionData.cart.error).to.eql("We're sorry, but we've encountered an issue while processing your registration request. To finalize your registration, please contact our Customer Service Center at (888) 744-4723.");
  };

  controller.confirmPayment(req, res, null);

  t.end();
});

test('confirmPayment handles non-specific reason code', function(t) {

  var res = {};
  var expCourseId = "course12345";
  var expSessionId = "session12345";
  var expUserId = "person12345";
  var errorReasonCode = "999";

  var sessionData = {
    authToken : authToken,
    userId: expUserId,
    cart: {
      courseId : expCourseId,
      sessionId : expSessionId,
      payment : {
      }
    }
  };
  var req = {
    body : {
      signed_field_names : "field1,field2",
      field1 : "value1",
      field2 : "value2",
      decision : "REVIEW",
      reason_code : errorReasonCode,
      req_card_number : "xxxx5555",
      req_card_expiry_date : "04/2018",
      transaction_id : "txn12345",
      auth_amount : "100.00",
      req_reference_number : "ref12345",
      signature : "IAmTheRealDeal"
    },
    session : {
      sessionData : sessionData
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

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {},
        "crypto-js" : {
          HmacSHA256: function (sigStr, secretKey) {
            expect(sigStr).to.eql("field1=value1,field2=value2");
            expect(secretKey).to.eql("fakeSecretKey");
            return "IAmAnEncryptedString";
          },
          enc : {
            Base64 : {
              stringify : function (hash) {
                expect(hash).to.eql("IAmAnEncryptedString");
                return req.body.signature;
              }
            }
          }
        },
        "konphyg": function(configPath) {
          var configFile = function(configName) {
            expect(configName).to.eql("properties")
            var config =
            {
              manage : {
                payment: {
                  "url" : "some.payment.url",
                  "profileId" : "fakeProfileId",
                  "accessKey" : "fakeAccessKey",
                  "secretKey" : "fakeSecretKey",
                  "declinedReasonCodes" : ["777", "666"],
                  "errorReasonCodes" : ["151", "152"]
                }
              }
            }
            return config;
          };
          return configFile;
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
            return false;
          }
        },
        "../../../API/contentful.js": {
          getCourseDetails: function(cb) {
            cb(contentfulCourseInfo, null);
          }
        }
      });

  controller.confirmPayment(req, res, null);

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
    authToken : authToken,
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
    session : {
      sessionData : sessionData
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
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {
          registerUser: function (userId, registrationRequest, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(authToken);
            expect(registrationRequest.registrations[0].orderNumber).to.be.an('null');
            expect(registrationRequest.registrations[0].studentId).to.eql(expUserId);
            expect(registrationRequest.registrations[0].sessionId).to.eql(expSessionId);
            expect(registrationRequest.payments[0].amount).to.eql(amount);
            expect(registrationRequest.payments[0].authorizationId).to.eql(authId);
            expect(registrationRequest.payments[0].merchantReferenceId).to.eql(referenceNumber);
            cb(null, registrationResult);
          }
        },
        "../../../API/contentful.js": {
          getCourseDetails: function(cb) {
            cb(contentfulCourseInfo, null);
          }
        }
      });

  res.render = function(page, content) {
    expect(page).to.eql('manage/cart/receipt');
    expect(content.title).to.eql('Course Registration - Receipt');
    expect(content.course).to.eql(course);
    expect(content.session).to.eql(courseSession);
    expect(content.registrations).to.eql(registrationResult.registrationResponse.registrations);
    expect(content.authorization).to.eql(authorization);
    expect(content.contentfulCourseInfo).to.eql(contentfulCourseInfo);

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
    authToken : authToken,
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
    session : {
      sessionData : sessionData
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
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {
          registerUser: function (userId, registrationRequest, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(authToken);
            expect(registrationRequest.registrations[0].orderNumber).to.be.an('null');
            expect(registrationRequest.registrations[0].studentId).to.eql(expUserId);
            expect(registrationRequest.registrations[0].sessionId).to.eql(expSessionId);
            expect(registrationRequest.payments[0].amount).to.eql(amount);
            expect(registrationRequest.payments[0].authorizationId).to.eql(authId);
            expect(registrationRequest.payments[0].merchantReferenceId).to.eql(referenceNumber);
            cb(null, registrationResult);
          }
        },
        "../../../API/contentful.js": {
          getCourseDetails: function(cb) {
            cb(contentfulCourseInfo, null);
          }
        }
      });

  res.render = function(page, content) {
    expect(page).to.eql('manage/cart/confirmation');
    expect(content.title).to.eql('Course Registration - Payment Review');
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

test('completePayment with payment accepted error', function(t) {

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
    authToken : authToken,
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
    session : {
      sessionData : sessionData
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
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {
          registerUser: function (userId, registrationRequest, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(authToken);
            expect(registrationRequest.registrations[0].orderNumber).to.be.an('null');
            expect(registrationRequest.registrations[0].studentId).to.eql(expUserId);
            expect(registrationRequest.registrations[0].sessionId).to.eql(expSessionId);
            expect(registrationRequest.payments[0].amount).to.eql(amount);
            expect(registrationRequest.payments[0].authorizationId).to.eql(authId);
            expect(registrationRequest.payments[0].merchantReferenceId).to.eql(referenceNumber);
            cb(null, registrationResult);
          }
        },
        "../../../API/contentful.js": {
          getCourseDetails: function(cb) {
            cb(contentfulCourseInfo, null);
          }
        }
      });

  res.render = function(page, content) {
    expect(page).to.eql('manage/cart/confirmation');
    expect(content.title).to.eql('Course Registration - Payment Review');
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
    authToken : authToken,
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
    session : {
      sessionData : sessionData
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
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {
          registerUser: function (userId, registrationRequest, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(authToken);
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
        },
        "../../../API/contentful.js": {
          getCourseDetails: function(cb) {
            cb(contentfulCourseInfo, null);
          }
        }

      });

  controller.completePayment(req, res, null);

  t.end();
});

test('displayPayment with registration exists', function(t) {

  var res = {};
  var expCourseId = "course12345";
  var expSessionId = "session12345";
  var expUserId = "person12345";
  var expectedUsername = "test@test.com";
  var expOfferingSessionId = "class000012345";
  var amount = "100.00";
  var authId = "authid12345";
  var referenceNumber = "refnumber12345";
  var authorization = {
    amount: amount,
    authId: authId,
    referenceNumber: referenceNumber
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
    },
    offeringSessionId : expOfferingSessionId
  };

  var sessionData = {
    authToken : authToken,
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
    session : {
      sessionData : sessionData
    }
  };

  var userData = {
    "id": expUserId,
    "username": expectedUsername,
    "password": null,
    "lastFourSSN": null,
    "timezoneId": "tzone000000000000007",
    "accountId": "accnt000000000582595",
    "currencyId": "crncy000000000000167",
    "split": "domin000000000000001",
    "timestamp": "1456153504261",
    "person": {
      "firstName": "Test",
      "middleName": null,
      "lastName": "User",
      "emailAddress": expectedUsername,
      "primaryPhone": "5555555555",
      "secondaryPhone": null,
      "primaryAddress": {
        "address1": "666 Test Road",
        "address2": "ATB",
        "city": "Testville",
        "state": "AL",
        "postalCode": "66666"
      },
      "secondaryAddress": null,
      "veteran": null,
      "dateOfBirth": "2011-02-10"
    }
  };

  var duplicateRegistrationResult = [{
        id : "regid12345",
        studentId: expUserId,
        sessionId: expSessionId,
        orderNumber: "012345"
  }];

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/course.js": {
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {
          getUser: function(userId, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(authToken);
            cb(null, userData);
          },
          getRegistration: function (userId, sessionId, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, duplicateRegistrationResult);
          }
        },
        "../../../helpers/common.js": {
          isNotEmpty: function (endDate) {
            return false;
          }
        },
        "konphyg": function(configPath) {
          var configFile = function(configName) {
            expect(configName).to.eql("properties")
            var config =
            {
              manage : {
                payment: {
                  "url" : "some.payment.url",
                  "profileId" : "fakeProfileId",
                  "accessKey" : "fakeAccessKey",
                  "secretKey" : "fakeSecretKey"
                }
              },
              session: {
                "useCache": false
              }
            }

            return config;
          };
          return configFile;
        }
      });

  res.redirect = function(page) {
    expect(page).to.eql('/manage/cart');
    expect(req.session.sessionData.cart.sessionId).to.eql(expSessionId);
    expect(req.session.sessionData.userId).to.eql(expUserId);
    should.exist(sessionData.cart.error);
    // make sure that the payment info was cleared from session data
    expect(req.session.sessionData.cart.payment).to.eql({});
  };

  controller.displayPayment(req, res, null);

  t.end();
});

test('displayPayment with multiple registrations exist', function(t) {

  var res = {};
  var expCourseId = "course12345";
  var expSessionId = "session12345";
  var expOfferingSessionId = "class000012345";
  var expUserId = "person12345";
  var expectedUsername = "test@test.com";
  var amount = "100.00";
  var authId = "authid12345";
  var referenceNumber = "refnumber12345";
  var authorization = {
    amount: amount,
    authId: authId,
    referenceNumber: referenceNumber
  };

  var sessionData = {
    authToken : authToken,
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
    session : {
      sessionData : sessionData
    }
  };

  var course  = {
    id : expCourseId
  };
  var userData = {
    "id": expUserId,
    "username": expectedUsername,
    "password": null,
    "lastFourSSN": null,
    "timezoneId": "tzone000000000000007",
    "accountId": "accnt000000000582595",
    "currencyId": "crncy000000000000167",
    "split": "domin000000000000001",
    "timestamp": "1456153504261",
    "person": {
      "firstName": "Test",
      "middleName": null,
      "lastName": "User",
      "emailAddress": expectedUsername,
      "primaryPhone": "5555555555",
      "secondaryPhone": null,
      "primaryAddress": {
        "address1": "666 Test Road",
        "address2": "ATB",
        "city": "Testville",
        "state": "AL",
        "postalCode": "66666"
      },
      "secondaryAddress": null,
      "veteran": null,
      "dateOfBirth": "2011-02-10"
    }
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
    },
    offeringSessionId : expOfferingSessionId
  };
  var duplicateRegistrationResult = [
    {
      id : "regid12345",
      studentId: expUserId,
      sessionId: expSessionId,
      orderNumber: "012345"
    },
    {
      id : "regid12347",
      studentId: expUserId,
      sessionId: expSessionId,
      orderNumber: "012346"
    }
  ];

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/manage/session-api.js": {
          setSessionData: function (req, key, value) {
            req.session.sessionData[key] = value;
            should.exist(sessionData.cart.error);
          },
          getSessionData: function(req, key){
            if (!req.session){
              return undefined;
            }
            if(!req.session.sessionData){
              req.session.sessionData = {};
              return undefined;
            } else {
              return req.session.sessionData[key];
            }
          }
        },
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {
          getUser: function(userId, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(authToken);
            cb(null, userData);
          },
          getRegistration: function (userId, sessionId, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, duplicateRegistrationResult);
          }
        },
        "../../../helpers/common.js": {
          isNotEmpty: function (endDate) {
            return true;
          }
        },
        "konphyg": function(configPath) {
          var configFile = function(configName) {
            expect(configName).to.eql("properties")
            var config =
            {
              manage : {
                payment: {
                  "url" : "some.payment.url",
                  "profileId" : "fakeProfileId",
                  "accessKey" : "fakeAccessKey",
                  "secretKey" : "fakeSecretKey"
                },
                session: {
                  "useCache": false
                }
              }
            }

            return config;
          };
          return configFile;
        }
      });

  res.redirect = function(page) {
    expect(page).to.eql('/manage/cart');
    expect(req.session.sessionData.cart.sessionId).to.eql(expSessionId);
    expect(req.session.sessionData.userId).to.eql(expUserId);
    should.exist(sessionData.cart.error);
    // make sure that the payment info was cleared from session data
    expect(req.session.sessionData.cart.payment).to.eql({});
  };

  controller.displayPayment(req, res, null);

  t.end();
});

test('displayPayment with no existing registration', function(t) {

  var res = {};
  var expCourseId = "course12345";
  var expSessionId = "session12345";
  var expOfferingSessionId = "class000012345";
  var expUserId = "person12345";
  var expectedUsername = "test@test.com";
  var amount = "100.00";
  var authId = "authid12345";
  var referenceNumber = "refnumber12345";
  var authorization = {
    amount: amount,
    authId: authId,
    referenceNumber: referenceNumber
  };

  var sessionData = {
    authToken : authToken,
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
    session : {
      sessionData : sessionData
    }
  };
  var course  = {
    id : expCourseId
  };
  var userData = {
    "id": expUserId,
    "username": expectedUsername,
    "password": null,
    "lastFourSSN": null,
    "timezoneId": "tzone000000000000007",
    "accountId": "accnt000000000582595",
    "currencyId": "crncy000000000000167",
    "split": "domin000000000000001",
    "timestamp": "1456153504261",
    "person": {
      "firstName": "Test",
      "middleName": null,
      "lastName": "User",
      "emailAddress": expectedUsername,
      "primaryPhone": "5555555555",
      "secondaryPhone": null,
      "primaryAddress": {
        "address1": "666 Test Road",
        "address2": "ATB",
        "city": "Testville",
        "state": "AL",
        "postalCode": "66666"
      },
      "secondaryAddress": null,
      "veteran": null,
      "dateOfBirth": "2011-02-10"
    }
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
    },
    offeringSessionId : expOfferingSessionId,
    tuition:500.50
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/course.js": {
          performExactCourseSearch: function (cb, courseId, authToken) {
            expect(authToken).to.eql(authToken);
            expect(courseId).to.eql(expCourseId);
            cb(null, null, course);
          },
          getSession: function (sessionId, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, courseSession);
          }
        },
        "../../../API/manage/user-api.js": {
          getUser: function(userId, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(authToken);
            cb(null, userData);
          },
          getRegistration: function (userId, sessionId, cb, authToken) {
            expect(userId).to.eql(expUserId);
            expect(authToken).to.eql(authToken);
            expect(sessionId).to.eql(expSessionId);
            cb(null, null);
          }
        },
        "../../../helpers/common.js": {
          isNotEmpty: function (endDate) {
            return true;
          }
        },
        "konphyg": function(configPath) {
          var configFile = function(configName) {
            expect(configName).to.eql("properties")
            var config =
            {
              manage : {
                payment: {
                  "url" : "some.payment.url",
                  "profileId" : "fakeProfileId",
                  "accessKey" : "fakeAccessKey",
                  "secretKey" : "fakeSecretKey"
                }
              }
            }

            return config;
          };
          return configFile;
        }
      });

  res.render = function(page, content) {
    expect(page).to.eql('manage/cart/payment');
    should.exist(sessionData.userId);
    expect(sessionData.cart.sessionId).to.eql(expSessionId);
    expect(sessionData.userId).to.eql(expUserId);
    expect(content.parameters.get("amount")).to.eql(courseSession.tuition);
    expect(content.parameters.get("bill_to_forename")).to.eql(userData.person.firstName);
    expect(content.parameters.get("bill_to_surname")).to.eql(userData.person.lastName);
    expect(content.parameters.get("bill_to_address_line1")).to.eql(userData.person.primaryAddress.address1);

    expect(req.session.sessionData.cart.sessionId).to.eql(expSessionId);
    expect(req.session.sessionData.userId).to.eql(expUserId);
    // make sure that the payment info was cleared from session data
    should.exist(req.session.sessionData.cart.payment);
  };

  controller.displayPayment(req, res, null);

  t.end();
});

test('cancelPayment from confirmation page with api failure', function(t) {
  var sessionId = "sesssion12345";
  var sessionData = {
    authToken : authToken,
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

  var res = {};
  var req = {
    session : {
      sessionData : sessionData
    }
  };

  res.redirect = function(page) {
    expect(page).to.eql('/manage/cart');
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js',
      {
        "../../../API/manage/payment-api.js": {
          sendAuthReversal: function (payments, cb, authToken) {
            expect(authToken).to.eql(authToken);
            expect(payments[0].amount).to.eql(sessionData.cart.payment.authorization.amount);
            expect(payments[0].authorizationId).to.eql(sessionData.cart.payment.authorization.authId);
            expect(payments[0].merchantReferenceId).to.eql(sessionData.cart.payment.authorization.referenceNumber);
            cb(new Error("I made the test fail"));
          }
        }
      });

  controller.cancelPayment(req, res, null);

  // make sure cart contents not removed
  expect(req.session.sessionData.cart.sessionId).to.eql(sessionId);
  // make sure that the payment info was cleared from session data
  expect(req.session.sessionData.cart.payment).to.eql({});

  t.end();
});

/**
 * Test for cancel button from cart page
 */
test('cancelRegistration from cart page', function(t) {
  var sessionId = "sesssion12345";
  var sessionData = {
    cart : {
      authToken : authToken,
      sessionId: sessionId
    }
  };
  
  var res = {};
  var req = {
    session : {
      sessionData : sessionData
    }
  };

  res.redirect = function(page) {
    expect(page).to.eql('/search');
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/cart-controller.js', {});

  controller.cancelRegistration(req, res, null);

  expect(req.session.sessionData.cart).to.eql({});

  t.end();
});