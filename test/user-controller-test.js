var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');

var encryptedPassword = "encryptedPassword";
var authToken =  "123456789123456789"

test('registrationLoginCreate', function(t) {
  var sessionData = {
    authToken : authToken,
    cart : {
      sessionId : "12345"
    }
  };

  var req = {
    session : {
      sessionData : sessionData
    }
  };
  var res = {};

  var expectedStates = ['Alaska'];
  var id1 = "1234";
  var name1 = "EASTERN";
  var id2 = "5678";
  var name2 = "CENTRAL";
  var expectedTimezones = [
    {
      "id": id1,
      "name": name1
    },
    {
      "id": id2,
      "name": name2
    }
  ];

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
  {
    "../../../API/contentful.js": {
      getReferenceData: function (slug, callback) {
        expect(slug).to.eql("us-states");
        callback(expectedStates, null);
      }
    },
    "../../../API/manage/session-api.js": {
      setSessionData: function (req, key, value) {
        if (!req.session.sessionData){
          req.session.sessionData = {};
        }
        req.session.sessionData[key] = value;

        // verify data passed in
        expect(value).to.eql(sessionData[key]);
      }
    },
    "../../../API/common-api.js": {
      getTimezones: function (callback, authtoken) {
        callback(null, expectedTimezones);
      }
    }
  });

  res.render = function(page, content) {
      expect(page).to.eql('manage/user/registration_login_create');
      expect(content.title).to.eql('Course Registration');
      expect(content.states[0]).to.eql(expectedStates[0]);
      expect(content.sessionId).to.eql(sessionData.cart.sessionId);
      expect(content.timezones[0]).to.eql(expectedTimezones[0]);
      expect(content.timezones[1]).to.eql(expectedTimezones[1]);
      expect(content.nextpage).to.eql('/manage/cart/payment');
  };

  controller.displayRegistrationLoginCreate(req, res, null);

  t.end();
});

test('registrationLoginCreate handles error', function(t) {
  var sessionData = {
    authToken : authToken,
    cart : {
      sessionId : "12345"
    }
  };
  var req = {
    session : {
      sessionData : sessionData
    }
  };

  var res = {};

  var expectedError = new Error("Intentional Test Error");

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
  {
    "../../../API/contentful.js": {
      getReferenceData: function (slug, callback) {
        expect(slug).to.eql("us-states");
        callback(null, expectedError);
      }
    },
    "../../../helpers/common.js": {
      redirectToError: function (resIn) {
        expect(resIn).to.eql(res)
      }
    },
    "../../../API/manage/session-api.js": {
      setSessionData: function (req, key, value) {
        if (!req.session.sessionData){
          req.session.sessionData = {};
        }
        req.session.sessionData[key] = value;

        // verify data passed in
        expect(value).to.eql(sessionData[key]);
      }
    }
  });

  controller.displayRegistrationLoginCreate(req, res, null);

  t.end();
});

test('registrationLoginCreate handles error with getting timezones', function(t) {
  var sessionData = {
    authToken : authToken,
    cart : {
      sessionId : "12345"
    }
  };
  var req = {
    session : {
      sessionData : sessionData
    }
  };
  var res = {};

  var expectedStates = ['Alaska'];

  var expectedError = new Error("Intentional Test Error");

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/contentful.js": {
          getReferenceData: function (slug, callback) {
            expect(slug).to.eql("us-states");
            callback(expectedStates, null);
          }
        },
        "../../../helpers/common.js": {
          redirectToError: function (resIn) {
            expect(resIn).to.eql(res)
          }
        },
        "../../../API/manage/session-api.js": {
          setSessionData: function (req, key, value) {
            if (!req.session.sessionData){
              req.session.sessionData = {};
            }
            req.session.sessionData[key] = value;

            // verify data passed in
            expect(value).to.eql(sessionData[key]);
          }
        },
        "../../../API/common-api.js": {
          getTimezones: function (callback, authtoken) {
            callback(expectedError, null);
          }
        }
      });

  controller.displayRegistrationLoginCreate(req, res, null);

  t.end();
});

test('displayCreate redirects home by default', function(t) {
  var req = {
    session : {
      sessionData : {
        authToken: "123456789123456789"
      }
    },
    body : {}
  };

  var res = {};
  var expectedStates = ['Alaska'];
  var id1 = "1234";
  var name1 = "EASTERN";
  var id2 = "5678";
  var name2 = "CENTRAL";
  var expectedTimezones = [
    {
      "id": id1,
      "name": name1
    },
    {
      "id": id2,
      "name": name2
    }
  ];


  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/contentful.js": {
          getReferenceData: function (slug, callback) {
            expect(slug).to.eql("us-states");
            callback(expectedStates, null);
          }
        },
        "../../../API/common-api.js": {
          getTimezones: function (callback, authtoken) {
            callback(null, expectedTimezones);
          }
        }
      });

  res.render = function(page, content) {
    expect(page).to.eql('manage/user/user_create');
    expect(content.title).to.eql('Create Account');
    expect(content.states[0]).to.eql(expectedStates[0]);
    expect(content.timezones[0]).to.eql(expectedTimezones[0]);
    expect(content.timezones[1]).to.eql(expectedTimezones[1]);
    expect(content.nextpage).to.eql('/');
  };

  controller.displayCreateUser(req, res, null);

  t.end();

});

test('displayCreate redirects to last page', function(t) {
  var expectedNextPage = "testpage";
  var req = {
    session : {
      sessionData : {
        authToken: "123456789123456789"
      }
    },
    body : {
      nextpage_after_create : expectedNextPage
    }
  };
  var res = {};
  var expectedStates = ['Alaska'];
  var id1 = "1234";
  var name1 = "EASTERN";
  var id2 = "5678";
  var name2 = "CENTRAL";
  var expectedTimezones = [
    {
      "id": id1,
      "name": name1
    },
    {
      "id": id2,
      "name": name2
    }
  ];

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/contentful.js": {
          getReferenceData: function (slug, callback) {
            expect(slug).to.eql("us-states");
            callback(expectedStates, null);
          }
        },
        "../../../API/common-api.js": {
          getTimezones: function (callback, authtoken) {
            callback(null, expectedTimezones);
          }
        }
      });

  res.render = function(page, content) {
    expect(page).to.eql('manage/user/user_create');
    expect(content.title).to.eql('Create Account');
    expect(content.states[0]).to.eql(expectedStates[0]);
    expect(content.timezones[0]).to.eql(expectedTimezones[0]);
    expect(content.timezones[1]).to.eql(expectedTimezones[1]);
    expect(content.nextpage).to.eql(expectedNextPage);
  };

  controller.displayCreateUser(req, res, null);

  t.end();
});

test('displayCreate handles error', function(t) {

  var req = {
    session : {
      sessionData : {
        authToken: "123456789123456789"
      }
    },
    body : { }
  };
  var res = {};

  var expectedError = new Error("Intentional Test Error");

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/contentful.js": {
          getReferenceData: function (slug, callback) {
            expect(slug).to.eql("us-states");
            callback(null, expectedError);
          }
        },
        "../../../helpers/common.js": {
          redirectToError: function (resIn) {
            expect(resIn).to.eql(res)
          }
        }
      });

  controller.displayCreateUser(req, res, null);

  t.end();
});

test('displayCreate handles error with getting timezones', function(t) {

  var req = {
    session : {
      sessionData : {
        authToken: "123456789123456789"
      }
    },
    body : { }
  };
  var res = {};

  var expectedStates = ['Alaska'];

  var expectedError = new Error("Intentional Test Error");

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/contentful.js": {
          getReferenceData: function (slug, callback) {
            expect(slug).to.eql("us-states");
            callback(expectedStates, null);
          }
        },
        "../../../helpers/common.js": {
          redirectToError: function (resIn) {
            expect(resIn).to.eql(res)
          }
        },
        "../../../API/common-api.js": {
          getTimezones: function (callback, authtoken) {
            callback(expectedError, null);
          }
        }
      });

  controller.displayCreateUser(req, res, null);

  t.end();
});

test('registrationLogin', function(t) {
  var sessionData = { authToken : authToken };
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    session : {
      sessionData : sessionData
    }
  };

  var authUser = {
      authToken : authToken,
      user : {
        id : "pers12345",
        person: {
          firstName : "Joseph"
        }
      },
    passwordChangeRequired: false
  };

  var setSessionCheckedCounter = 0;

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
  {
    "../../../API/manage/session-api.js": {
      setSessionData: function (req, key, value) {
        if (!req.session.sessionData){
          req.session.sessionData = {};
        }
        req.session.sessionData[key] = value;

        if (key==="passwordChangeAuthUserId"){
          expect(value).to.eql(authUser.user.id);
          setSessionCheckedCounter++;
        } else if (key==="passwordChangeAuthUsername"){
          expect(value).to.eql(authUser.user.username);
          setSessionCheckedCounter++;
        }
        else {
          // if called with any other data then throw error
          expect(true).to.eql(false);
        }
      }
    },
    '../../../API/authentication-api.js': {
      loginUser: function (req, res, authCredentials, cb) {
        expect(authCredentials.username).to.eql(req.body.username);
        expect(authCredentials.password).to.eql(encryptedPassword);
        cb(null, authUser);
      },
      encryptPassword: function(password) {
        expect(password).to.eql(req.body.password);
        return encryptedPassword;
      }
    }
  });

  res.redirect = function(page) {
      expect(page).to.eql('/manage/cart/payment');
      expect(setSessionCheckedCounter).to.eql(2);
      expect(req.session.sessionData["pwResetRequiredMessage"]).to.be.undefined;
  };

  controller.registrationLogin(req, res, null);

  t.end();
});

test('registrationLogin needs password change', function(t) {
  var sessionData = { authToken : authToken };
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    session : {
      sessionData : sessionData
    }
  };

  var authUser = {
    authToken : authToken,
    user : {
      id : "pers12345",
      person: {
        firstName : "Joseph"
      }
    },
    passwordChangeRequired: true
  };

  var setSessionCheckedCounter = 0;

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/manage/session-api.js": {
          setSessionData: function (req, key, value) {
            if (!req.session.sessionData){
              req.session.sessionData = {};
            }
            req.session.sessionData[key] = value;

            if (key==="pwResetRequiredMessage"){
              expect(value).to.eql("For security purposes, please reset your password");
              setSessionCheckedCounter++;
            } else if (key==="passwordChangeAuthUserId"){
              expect(value).to.eql(authUser.user.id);
              setSessionCheckedCounter++;
            } else if (key==="passwordChangeAuthUsername"){
              expect(value).to.eql(authUser.user.username);
              setSessionCheckedCounter++;
            } else if (key==="passwordResetRequired"){
              expect(value).to.eql(true);
              setSessionCheckedCounter++;
            }
            else {
              // if called with any other data then throw error
              expect(true).to.eql(false);
            }
          }
        },
        '../../../API/authentication-api.js': {
          loginUser: function (req, res, authCredentials, cb) {
            expect(authCredentials.username).to.eql(req.body.username);
            expect(authCredentials.password).to.eql(encryptedPassword);
            cb(null, authUser);
          },
          encryptPassword: function(password) {
            expect(password).to.eql(req.body.password);
            return encryptedPassword;
          }
        }
      });

  res.redirect = function(page) {
    expect(page).to.eql('/manage/user/password/change');
    expect(setSessionCheckedCounter).to.eql(3);
    expect(req.session.sessionData["passwordResetRequired"]).to.eq(true);
  };

  controller.registrationLogin(req, res, null);

  t.end();
});

test('registrationLogin should handle login failure', function(t) {
  var sessionData = {authToken : authToken };
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    session : {
      sessionData : sessionData
    }
  };

  var userId = "pers12345";

  var authUser = {
    authToken : authToken,
    user : {
      id : userId,
      person: {
        firstName : "Joseph"
      }
    }
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/manage/session-api.js": {
          setSessionData: function (req, key, value) {
            if (!req.session.sessionData){
              req.session.sessionData = {};
            }
            req.session.sessionData[key] = value;

            // verify data passed in
            expect(key).to.eql("loginError");
            expect(value).to.eql("Login failed, please try again");
          }
        },

        '../../../API/authentication-api.js': {
          loginUser: function (req, res, authCredentials, cb) {
            expect(authCredentials.username).to.eql(req.body.username);
            expect(authCredentials.password).to.eql(encryptedPassword);
            cb(new Error("I am not the droid you are looking for"), authUser, 401);
          },
          encryptPassword: function(password) {
            expect(password).to.eql(req.body.password);
            return encryptedPassword;
          }

        }
      });

  res.redirect = function(page) {
    expect(page).to.eql('registration_login_create');
  };

  controller.registrationLogin(req, res, null);

  t.end();
});

test('registrationLogin should handle other error', function(t) {
  var sessionData = {authToken : authToken };
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    session : {
      sessionData : sessionData
    }
  };

  var userId = "pers12345";

  var authUser = {
      authToken : authToken,
      user : {
        id : userId,
        person: {
          firstName : "Joseph"
        }
      }
  }

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
  {
    "../../../API/manage/session-api.js": {
      setSessionData: function (req, key, value) {
        if (!req.session.sessionData) {
          req.session.sessionData = {};
        }
        req.session.sessionData[key] = value;

        // verify data passed in
        expect(key).to.eql("loginError");
        expect(value).to.eql("There was an issue with your request. Please try again in a few minutes");
      }
    },

    '../../../API/authentication-api.js': {
      loginUser: function (req, res, authCredentials, cb) {
        expect(authCredentials.username).to.eql(req.body.username);
        expect(authCredentials.password).to.eql(encryptedPassword);
        cb(new Error("I am not the droid you are looking for"), authUser, 500);
      },
      encryptPassword: function(password) {
        expect(password).to.eql(req.body.password);
        return encryptedPassword;
      }
    }
  });

  res.redirect = function(page) {
      expect(page).to.eql('registration_login_create');
  };

  controller.registrationLogin(req, res, null);

  t.end();
});

test('createUser', function(t) {
  var sessionData = { authToken : authToken };
  var formattedDateOfBirth = "20160315";
  var res = {};
  var req = {
    body : {
      email : "test@test.com",
      password : "test1234",
      lastFourSSN : "5555",
      firstName : "Joe",
      middleName : "The",
      lastName : "Tester",
      phone : "5555555555",
      street : "55 Test Way",
      suite : "Suite 5",
      timezoneId : "123",
      city : "Test City",
      state : "UT",
      zip : "55555",
      dateOfBirth : "03/15/2016"
    },
    session : {
      sessionData : sessionData
    }
  };

  var userId = "pers12345";
  var authUser = {
      authToken : authToken,
      user : {
        id : userId,
        person: {
          firstName : "Joseph"
        }
      }
  }

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
  {
    "../../../API/manage/session-api.js": {
      setSessionData: function (req, key, value) {
        if (!req.session.sessionData){
          req.session.sessionData = {};
        }
        req.session.sessionData[key] = value;

        expect(value).to.eql(sessionData[key]);
      }
    },
    "../../../API/manage/user-api.js": {
      createUser: function (userData, cb, authToken) {

        expect(userData.username).to.eql(req.body.email);
        expect(userData.password).to.eql(encryptedPassword);
        expect(userData.lastFourSSN).to.eql(req.body.lastFourSSN);
        expect(userData.person.firstName).to.eql(req.body.firstName);
        expect(userData.person.middleName).to.eql(req.body.middleName);
        expect(userData.person.lastName).to.eql(req.body.lastName);
        expect(userData.person.emailAddress).to.eql(req.body.email);
        expect(userData.person.primaryPhone).to.eql(req.body.phone);
        expect(userData.person.secondaryPhone).to.eql(null);
        expect(userData.person.primaryAddress.address1).to.eql(req.body.street);
        expect(userData.person.primaryAddress.address2).to.eql(req.body.suite);
        expect(userData.person.primaryAddress.city).to.eql(req.body.city);
        expect(userData.person.primaryAddress.state).to.eql(req.body.state);
        expect(userData.person.primaryAddress.postalCode).to.eql(req.body.zip);
        expect(userData.person.secondaryAddress).to.eql(null);
        expect(userData.person.dateOfBirth).to.eql(formattedDateOfBirth);
        expect(userData.timezoneId).to.eql(req.body.timezoneId);

        expect(authToken).to.eql(authToken);

        // put an id in the user data and return it as created userData
        userData.id = userId;
        var result = {
          createdUser : userData,
          generalError : false,
          duplicateUserError : false,
          validationErrors : null
        };

        cb(null, result);
        return;
      }
    },
    '../../../API/authentication-api.js': {
      loginUser: function (req, res, authCredentials, cb) {
        expect(authCredentials.username).to.eql(req.body.email);
        expect(authCredentials.password).to.eql(encryptedPassword);
        cb(null, authUser);
      },
      encryptPassword: function(password) {
        expect(password).to.eql(req.body.password);
        return encryptedPassword;
      }
    }
  });

  res = {
    status : function (status) {
      expect(status).to.eql(201);
      return {
        send : function () {
          // just make sure this function is called
          expect(1).to.eql(1);
        }
      }
    }
  };

  controller.createUser(req, res, null);

  t.end();
});

test('createUser handles validation error', function(t) {
  var sessionData = { authToken : authToken };
  var res = {};
  var req = {
    body : {
      email : "test@test.com",
      password : "test1234",
      lastFourSSN : "5555",
      firstName : "Joe",
      middleName : "The",
      lastName : "Tester",
      phone : "5555555555",
      street : "55 Test Way",
      suite : "Suite 5",
      timezoneId : "123",
      city : "Test City",
      state : "UT",
      zip : "55555",
      dateOfBirth : ""
    },
    session : {
      sessionData : sessionData
    }
  };

  var userId = "pers12345";
  var authUser = {
    authToken : authToken,
    user : {
      id : userId,
      person: {
        firstName : "Joseph"
      }
    }
  };
  var validationErrors = [
    {
      "fieldName": "person.dateOfBirth",
      "errorMessage": "Date of Birth is not in yyyyMMdd format"
    }
  ];

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/manage/session-api.js": {
          setSessionData: function (req, key, value) {
            if (!req.session.sessionData){
              req.session.sessionData = {};
            }
            req.session.sessionData[key] = value;

            if (key==="userId"){
              expect(value).to.eql(authUser.user.id);
            } else if (key==="userFirstName"){
              expect(value).to.eql(authUser.user.person.firstName);
            }
            else {
              // if called with any other data then throw error
              expect(true).to.eql(false);
            }
          }
        },
        "../../../API/manage/user-api.js": {
          createUser: function (userData, cb, authToken) {

            expect(userData.username).to.eql(req.body.email);
            expect(userData.password).to.eql(encryptedPassword);
            expect(userData.lastFourSSN).to.eql(req.body.lastFourSSN);
            expect(userData.person.firstName).to.eql(req.body.firstName);
            expect(userData.person.middleName).to.eql(req.body.middleName);
            expect(userData.person.lastName).to.eql(req.body.lastName);
            expect(userData.person.emailAddress).to.eql(req.body.email);
            expect(userData.person.primaryPhone).to.eql(req.body.phone);
            expect(userData.person.secondaryPhone).to.eql(null);
            expect(userData.person.primaryAddress.address1).to.eql(req.body.street);
            expect(userData.person.primaryAddress.address2).to.eql(req.body.suite);
            expect(userData.person.primaryAddress.city).to.eql(req.body.city);
            expect(userData.person.primaryAddress.state).to.eql(req.body.state);
            expect(userData.person.primaryAddress.postalCode).to.eql(req.body.zip);
            expect(userData.person.secondaryAddress).to.eql(null);
            expect(userData.person.dateOfBirth).to.eql(null);

            expect(authToken).to.eql(authToken);
            var result = {
              createdUser : null,
              generalError : false,
              duplicateUserError : false,
              validationErrors : validationErrors
            };
            cb(new Error("Intentional test failure"), result);
            return;
          }
        },
        '../../../API/authentication-api.js': {
          encryptPassword: function(password) {
            expect(password).to.eql(req.body.password);
            return encryptedPassword;
          }
        }
      });

  var expectedError = {
    error: "We have experienced a problem creating your account. Please correct the information and try again."
  };

  res = {
    status : function (status) {
      expect(status).to.eql(400);
      return {
        send : function (body) {
          // just make sure this function is called
          expect(body.error).to.eql(expectedError.error);
          expect(body.validationErrors).to.eql(validationErrors)
        }
      }
    }
  };

  controller.createUser(req, res, null);

  t.end();
});

test('createUser handles general error', function(t) {
  var sessionData = { authToken : authToken };
  var formattedDateOfBirth = "20160315";
  var res = {};
  var req = {
    body : {
      email : "test@test.com",
      password : "test1234",
      lastFourSSN : "5555",
      firstName : "Joe",
      middleName : "The",
      lastName : "Tester",
      phone : "5555555555",
      street : "55 Test Way",
      suite : "Suite 5",
      timezoneId : "123",
      city : "Test City",
      state : "UT",
      zip : "55555",
      dateOfBirth : "03/15/2016"
    },
    session : {
      sessionData : sessionData
    }
  };

  var userId = "pers12345";
  var authUser = {
    authToken : authToken,
      user : {
        id : userId,
        person: {
          firstName : "Joseph"
        }
      }
  }

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
  {
    "../../../API/manage/session-api.js": {
      setSessionData: function (req, key, value) {
        if (!req.session.sessionData){
          req.session.sessionData = {};
        }
        req.session.sessionData[key] = value;

        if (key==="userId"){
          expect(value).to.eql(authUser.user.id);
        } else if (key==="userFirstName"){
          expect(value).to.eql(authUser.user.person.firstName);
        }
        else {
          // if called with any other data then throw error
          expect(true).to.eql(false);
        }
      }
    },
    "../../../API/manage/user-api.js": {
      createUser: function (userData, cb, authToken) {

        expect(userData.username).to.eql(req.body.email);
        expect(userData.password).to.eql(encryptedPassword);
        expect(userData.lastFourSSN).to.eql(req.body.lastFourSSN);
        expect(userData.person.firstName).to.eql(req.body.firstName);
        expect(userData.person.middleName).to.eql(req.body.middleName);
        expect(userData.person.lastName).to.eql(req.body.lastName);
        expect(userData.person.emailAddress).to.eql(req.body.email);
        expect(userData.person.primaryPhone).to.eql(req.body.phone);
        expect(userData.person.secondaryPhone).to.eql(null);
        expect(userData.person.primaryAddress.address1).to.eql(req.body.street);
        expect(userData.person.primaryAddress.address2).to.eql(req.body.suite);
        expect(userData.person.primaryAddress.city).to.eql(req.body.city);
        expect(userData.person.primaryAddress.state).to.eql(req.body.state);
        expect(userData.person.primaryAddress.postalCode).to.eql(req.body.zip);
        expect(userData.person.secondaryAddress).to.eql(null);
        expect(userData.person.dateOfBirth).to.eql(formattedDateOfBirth);

        expect(authToken).to.eql(authToken);
        var result = {
          createdUser : null,
          generalError : true,
          duplicateUserError : false,
          validationErrors : null
        };
        cb(new Error("Intentional test failure"), result);
        return;
      }
    },
    '../../../API/authentication-api.js': {
      encryptPassword: function(password) {
        expect(password).to.eql(req.body.password);
        return encryptedPassword;
      }
    }
  });

  var expectedError = {
    error: "We have experienced a problem processing your request, please try again later."
  };

  res = {
    status : function (status) {
      expect(status).to.eql(500);
      return {
        send : function (body) {
          // just make sure this function is called
          expect(body).to.eql(expectedError);
        }
      }
    }
  };

  controller.createUser(req, res, null);

  t.end();
});

test('createUser handles login user error', function(t) {
  var sessionData = { authToken : authToken };
  var formattedDateOfBirth = "20160315";
  var res = {};
  var req = {
    body : {
      email : "test@test.com",
      password : "test1234",
      lastFourSSN : "5555",
      firstName : "Joe",
      middleName : "The",
      lastName : "Tester",
      phone : "5555555555",
      street : "55 Test Way",
      suite : "Suite 5",
      timezoneId : "123",
      city : "Test City",
      state : "UT",
      zip : "55555",
      dateOfBirth : "03/15/2016"
    },
    session : {
      sessionData : sessionData
    }
  };

  var userId = "pers12345";
  var authUser = {
    authToken : authToken,
    user : {
      id : userId,
      person: {
        firstName : "Joseph"
      }
    }
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
  {
    "../../../API/manage/session-api.js": {
      setSessionData: function (req, key, value) {
        if (!req.session.sessionData){
          req.session.sessionData = {};
        }
        req.session.sessionData[key] = value;

        expect(value).to.eql(sessionData[key]);
      }
    },
    "../../../API/manage/user-api.js": {
      createUser: function (userData, cb, authToken) {

        expect(userData.username).to.eql(req.body.email);
        expect(userData.password).to.eql(encryptedPassword);
        expect(userData.lastFourSSN).to.eql(req.body.lastFourSSN);
        expect(userData.person.firstName).to.eql(req.body.firstName);
        expect(userData.person.middleName).to.eql(req.body.middleName);
        expect(userData.person.lastName).to.eql(req.body.lastName);
        expect(userData.person.emailAddress).to.eql(req.body.email);
        expect(userData.person.primaryPhone).to.eql(req.body.phone);
        expect(userData.person.secondaryPhone).to.eql(null);
        expect(userData.person.primaryAddress.address1).to.eql(req.body.street);
        expect(userData.person.primaryAddress.address2).to.eql(req.body.suite);
        expect(userData.person.primaryAddress.city).to.eql(req.body.city);
        expect(userData.person.primaryAddress.state).to.eql(req.body.state);
        expect(userData.person.primaryAddress.postalCode).to.eql(req.body.zip);
        expect(userData.person.secondaryAddress).to.eql(null);
        expect(userData.person.dateOfBirth).to.eql(formattedDateOfBirth);

        expect(authToken).to.eql(authToken);

        // put an id in the user data and return it as created userData
        userData.id = userId;
        var result = {
          createdUser : userData,
          generalError : false,
          duplicateUserError : false,
          validationErrors : null
        };
        cb(null, result);
        return;
      }
    },
    '../../../API/authentication-api.js': {
      loginUser: function (req, res, authCredentials, cb) {
        expect(authCredentials.username).to.eql(req.body.email);
        expect(authCredentials.password).to.eql(encryptedPassword);
        cb(new Error("I man authentication fail"), null);
      },
      encryptPassword: function(password) {
        expect(password).to.eql(req.body.password);
        return encryptedPassword;
      }
    }
  });

  var expectedError = {
    error: "We have experienced a problem processing your request, please try again later."
  };

  res = {
    status : function (status) {
      expect(status).to.eql(500);
      return {
        send : function (body) {
          // just make sure this function is called
          expect(body).to.eql(expectedError);
        }
      }
    }
  };

  controller.createUser(req, res, null);

  t.end();
});

test('login', function(t) {
  var sessionData = { authToken : authToken };
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    session : {
      sessionData : sessionData
    }
  };

  var authUser = {
    authToken : authToken,
    user : {
      id : "pers12345",
      person: {
        firstName : "Joseph"
      }
    },
    passwordChangeRequired: false
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/manage/session-api.js": {
          setSessionData: function (req, key, value) {
            if (!req.session.sessionData){
              req.session.sessionData = {};
            }
            req.session.sessionData[key] = value;

            if (key==="userId"){
              expect(value).to.eql(authUser.user.id);
            } else if (key==="userFirstName"){
              expect(value).to.eql(authUser.user.person.firstName);
            } else if (key==="passwordChangeAuthUserId"){
              expect(value).to.eql(authUser.user.id);
            } else if (key==="passwordChangeAuthUsername"){
              expect(value).to.eql(authUser.user.username);
            }else if (key==="passwordResetRequired"){
              expect(value).to.eql(true);
            }
            else {
              // if called with any other data then throw error
              expect(true).to.eql(false);
            }
          }
        },
        '../../../API/authentication-api.js': {
          loginUser: function (req, res, authCredentials, cb) {
            expect(authCredentials.username).to.eql(req.body.username);
            expect(authCredentials.password).to.eql(encryptedPassword);
            cb(null, authUser);
          },
          encryptPassword: function(password) {
            expect(password).to.eql(req.body.password);
            return encryptedPassword;
          }
        }
      });

  res = {
    status : function (status) {
      expect(status).to.eql(200);
      return {
        send : function () {
          // just make sure this function is called
          expect(1).to.eql(1);
          expect(req.session.sessionData["pwResetRequiredMessage"]).to.be.undefined;
        }
      }
    }
  };

  controller.login(req, res, null);

  t.end();
});

test('login success needs password change', function(t) {
  var sessionData = { authToken : authToken };
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    session : {
      sessionData : sessionData
    }
  };

  var authUser = {
    authToken : authToken,
    user : {
      id : "pers12345",
      person: {
        firstName : "Joseph"
      }
    },
    passwordChangeRequired: true
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/manage/session-api.js": {
          setSessionData: function (req, key, value) {
            if (!req.session.sessionData){
              req.session.sessionData = {};
            }
            req.session.sessionData[key] = value;

            if (key==="pwResetRequiredMessage"){
              expect(value).to.eql("For security purposes, please reset your password");
            } else if (key==="passwordChangeAuthUserId"){
              expect(value).to.eql(authUser.user.id);
            } else if (key==="passwordChangeAuthUsername"){
              expect(value).to.eql(authUser.user.username);
            }else if (key==="passwordResetRequired"){
              expect(value).to.eql(true);
            }
            else {
              // if called with any other data then throw error
              expect(true).to.eql(false);
            }
          }
        },
        '../../../API/authentication-api.js': {
          loginUser: function (req, res, authCredentials, cb) {
            expect(authCredentials.username).to.eql(req.body.username);
            expect(authCredentials.password).to.eql(encryptedPassword);
            cb(null, authUser);
          },
          encryptPassword: function(password) {
            expect(password).to.eql(req.body.password);
            return encryptedPassword;
          }
        }
      });

  res = {
    status : function (status) {
      expect(status).to.eql(401);
      return {
        send : function () {
          // just make sure this function is called
          expect(1).to.eql(1);
          expect(req.session.sessionData["passwordResetRequired"]).to.eq(true);
        }
      }
    }
  };

  controller.login(req, res, null);

  t.end();
});

test('login should handle failed login error', function(t) {
  var sessionData = { authToken : authToken };
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    session : {
      sessionData : sessionData
    }
  };


  var expectedError = {
    error: "Login failed, please try again"
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        '../../../API/authentication-api.js': {
          loginUser: function (req, res, authCredentials, cb) {
            expect(authCredentials.username).to.eql(req.body.username);
            expect(authCredentials.password).to.eql(encryptedPassword);
            cb(new Error("I am not the droid you are looking for"), null, 401);
          },
          encryptPassword: function(password) {
            expect(password).to.eql(req.body.password);
            return encryptedPassword;
          }
        }
      });

  res = {
    status : function (status) {
      expect(status).to.eql(401);
      return {
        send : function (body) {
          // just make sure this function is called
          expect(body).to.eql(expectedError);
        }
      }
    }
  };

  controller.login(req, res, null);

  t.end();
});

test('login should handle other error', function(t) {
  var sessionData = { authToken : authToken };
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    session : {
      sessionData : sessionData
    }
  };

  var expectedError = {
    error: "There was an issue with your request. Please try again in a few minutes"
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        '../../../API/authentication-api.js': {
          loginUser: function (req, res, authCredentials, cb) {
            expect(authCredentials.username).to.eql(req.body.username);
            expect(authCredentials.password).to.eql(encryptedPassword);
            cb(new Error("I am not the droid you are looking for"), null, 500);
          },
          encryptPassword: function(password) {
            expect(password).to.eql(req.body.password);
            return encryptedPassword;
          }
        }
      });

  res = {
    status : function (status) {
      expect(status).to.eql(500);
      return {
        send : function (body) {
          // just make sure this function is called
          expect(body).to.eql(expectedError);
        }
      }
    }
  };

  controller.login(req, res, null);

  t.end();
});

test('logout', function(t) {
  var authToken = "12345";
  var sessionData = {
    authToken : authToken,
    user : {
      id: "user1234",
      person: {
        firstName: "TestUser"
      }
    },
    cart: {
      courseId : "course2345",
      sessionId : "session3456",
      payment : {
        stuff: "4567"
      }
    }
  };
  var req = {
    cookies: {
      gssession: sessionData.userId
    },
    session : {
      sessionData : sessionData
    }
  };

  var res = {
    cookies: {
      gssession: null
    }
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/manage/session-api.js": {
          clearSessionData: function (reqParameter) {
            expect(reqParameter).to.eql(req);
            req.session.sessionData = {};
          }
        }
      });

  res.redirect = function(page) {
    expect(page).to.eql('/');
  };

  controller.logout(req, res, null);

  t.end();
});

test('logoutAsync', function(t) {
  var authToken = "12345";
  var sessionData = {
    authToken : authToken,
    user : {
      id: "user1234",
      person: {
        firstName: "TestUser"
      }
    },
    cart: {
      courseId : "course2345",
      sessionId : "session3456",
      payment : {
        stuff: "4567"
      }
    }
  };
  var req = {
    session : {
      sessionData : sessionData
    }
  };

  var res = {
    status : function (status) {
      expect(status).to.eql(200);
      return {
        send : function () {
          expect(req.session.sessionData).to.eql({});
        }
      }
    }
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/manage/session-api.js": {
          clearSessionData: function (reqParameter) {
            expect(reqParameter).to.eql(req);
            req.session.sessionData = {};
          }
        }
      });

  controller.logoutAsync(req, res, null);

  t.end();
});

test('displayLogin', function(t) {

  var loginMessage = "blah blah blah";
  var req = {};
  var res = {};
  res.render = function(page, content) {
    expect(page).to.eql('manage/user/standalone_login');
    expect(content.title).to.eql('Login');
    expect(content.loginMessage).to.eql(loginMessage);
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        '../../../API/manage/session-api.js': {
          getSessionData: function (req, key) {
            expect(key).to.eql("loginMessage");
            return loginMessage;
          },
          setSessionData: function (req, key, value) {
            expect(key).to.eql("loginMessage");
            expect(value).to.eql(null);
          }
        }
      });

  controller.displayLogin(req, res, null);

  t.end();
});

test('displayForgotPassword', function(t) {

  var req = {};
  var res = {};
  res.render = function(page, content) {
    expect(page).to.eql('manage/user/forgot_password');
    expect(content.title).to.eql('Forgot Password');
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
      });

  controller.displayForgotPassword(req, res, null);

  t.end();
});

test('displayChangePassword', function(t) {

  var req = {};
  var res = {};
  res.render = function(page, content) {
    expect(page).to.eql('manage/user/change_password');
    expect(content.title).to.eql('Update Your Password');
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
      });

  controller.displayChangePassword(req, res, null);

  t.end();
});

test('forgotPassword', function(t) {

  var req = {
    body: {
      email: "test@test.com"
    }
  };
  var res = {};
  res.render = function(page, content) {
    expect(page).to.eql('manage/user/forgot_password');
    expect(content.title).to.eql('Forgot Password');
    expect(content.passwordReset).to.eql(true);
    expect(content.userNotFound).to.eql(false);
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        '../../../API/manage/user-api.js': {
          forgotPassword: function (req, authCredentials, callback) {
            expect(authCredentials.username).to.eql(req.body.email);
            callback(null, true, false);
          }
        }
      });

  controller.forgotPassword(req, res, null);

  t.end();
});

test('displayMyAccount', function(t) {
  var expectedTab = "testTab";
  var startDateTime = ((new Date().getTime()) - 86400000).toString();
  var endDateTime = ((new Date().getTime()) + 86400000).toString();
  var regDetailsList = [
    {
      "sessionNo": "1234567",
      "courseNo": "COURSE1234",
      "courseTitle": "Introduction to Testing",
      "startDate" : startDateTime,
      "endDate" : endDateTime,
      "address" : {
        "address1": "123 Main Street",
        "address2": "Suite 100",
        "city": "Washington",
        "state": "DC",
        "postalCode": "12345"
      },
      "type" : "CLASSROOM"
    }
  ];

  var sessionData = {
    authToken: authToken,
    user : {
      id: "person12345",
      person: {
        firstName: "TestUser"
      }
    }
  };
  var req = {
    query : {
      tab: expectedTab
    },
    session : sessionData
  };
  var res = {};
  res.render = function(page, content) {
    expect(page).to.eql('manage/user/account');
    expect(content.title).to.eql('My Account');
    expect(content.activeTab).to.eql(expectedTab);
    expect(content.registrations).to.eql(regDetailsList);
    expect(content.states).to.eql(expectedStates);
    expect(content.timezones).to.eql(expectedTimezones);
    expect(content.user).to.eql(sessionData.user);
  };

  var expectedStates = ['Alaska'];
  var expectedTimezones = [
    {
      "id": "11111",
      "name": "Test Zone"
    }
  ];

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js', {
    "../../../API/contentful.js": {
      getReferenceData: function (slug, callback) {
        expect(slug).to.eql("us-states");
        callback(expectedStates, null);
      }
    },
    "../../../API/common-api.js": {
      getTimezones: function (callback, authtoken) {
        callback(null, expectedTimezones);
      }
    },
    '../../../API/manage/session-api.js': {
      getSessionData: function (req, key) {
        if (key == "user") {
          return sessionData.user;
        }
        else if (key == "authToken") {
          return sessionData.authToken;
        }
        else {
          return undefined;
        }
      }
    },
    '../../../API/manage/user-api.js': {
      getUserRegistrations: function (req, userId, callback) {
        expect(userId).to.eql(sessionData.user.id);
        callback(null, regDetailsList);
      }
    }
  });

  controller.displayMyAccount(req, res, null);

  t.end();
});

test('displayMyAccount default tab', function(t) {
  var startDateTime = ((new Date().getTime()) - 86400000).toString();
  var endDateTime = ((new Date().getTime()) + 86400000).toString();
  var regDetailsList = [
    {
      "sessionNo": "1234567",
      "courseNo": "COURSE1234",
      "courseTitle": "Introduction to Testing",
      "startDate" : startDateTime,
      "endDate" : endDateTime,
      "address" : {
        "address1": "123 Main Street",
        "address2": "Suite 100",
        "city": "Washington",
        "state": "DC",
        "postalCode": "12345"
      },
      "type" : "CLASSROOM"
    }
  ];

  var sessionData = {
    authToken: authToken,
    user : {
      id: "person12345",
      person: {
        firstName: "TestUser"
      }
    }
  };
  var req = {
    query : {},
    session : {
      sessionData: sessionData
    }
  };
  var res = {};
  res.render = function(page, content) {
    expect(page).to.eql('manage/user/account');
    expect(content.title).to.eql('My Account');
    expect(content.activeTab).to.eql("my-profile");
    expect(content.registrations).to.eql(regDetailsList);
    expect(content.states).to.eql(expectedStates);
    expect(content.timezones).to.eql(expectedTimezones);
    expect(content.user).to.eql(sessionData.user);
  };

  var expectedStates = ['Alaska'];
  var expectedTimezones = [
    {
      "id": "11111",
      "name": "Test Zone"
    }
  ];

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js', {
    "../../../API/contentful.js": {
      getReferenceData: function (slug, callback) {
        expect(slug).to.eql("us-states");
        callback(expectedStates, null);
      }
    },
    "../../../API/common-api.js": {
      getTimezones: function (callback, authtoken) {
        callback(null, expectedTimezones);
      }
    },
    '../../../API/manage/session-api.js': {
      getSessionData: function (req, key) {
        if (key == "user") {
          return sessionData.user;
        }
        else if (key == "authToken") {
          return sessionData.authToken;
        }
        else {
          return undefined;
        }
      }
    },
    '../../../API/manage/user-api.js': {
      getUserRegistrations: function (req, userId, callback) {
        expect(userId).to.eql(sessionData.user.id);
        callback(null, regDetailsList);
      }
    }
  });

  controller.displayMyAccount(req, res, null);

  t.end();
});

test('displayMyAccount error if not logged in', function(t) {
  var req = {
    query : {},
    session :{}
  };
  var res = {};

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js', {
    '../../../API/manage/session-api.js': {
      getSessionData: function (req, key) {
        if (key == "user") {
          return undefined;
        }
        return {};
      }
    },
    "../../../helpers/common.js": {
      redirectToError: function (response) {
        expect(response).to.eql(res);
      }
    }
  });

  controller.displayMyAccount(req, res, null);

  t.end();
});

test('displayMyAccount error getting registrations', function(t) {
  var expUserId = "person12345";

  var expError = new Error("Intentional Error");

  var sessionData = {
    authToken: authToken,
    userId: expUserId
  };
  var req = {
    query : {},
    session : {
      sessionData: sessionData
    }
  };
  var res = {};
  res.render = function(page, content) {
    expect(page).to.eql('manage/user/account');
    expect(content.title).to.eql('My Account');
    expect(content.activeTab).to.eql("my-profile");
    expect(content.registrations).to.eql(regDetailsList);
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js', {
    '../../../API/manage/session-api.js': {
      getSessionData: function (req, key) {
        if (key == "user") {
          return sessionData.user;
        }
        else if (key == "authToken") {
          return sessionData.authToken;
        }
        else {
          return undefined;
        }
      }
    },
    '../../../API/manage/user-api.js': {
      getUserRegistrations: function (req, userId, callback) {
        expect(userId).to.eql(expUserId);
        callback(expError, null);
      }
    },
    "../../../helpers/common.js": {
      redirectToError: function (response) {
        expect(response).to.eql(res);
      }
    }
  });

  controller.displayMyAccount(req, res, null);

  t.end();
});

test('forgotPassword when user not found', function(t) {

  var req = {
    body: {
      email: "test@test.com"
    }
  };
  var res = {};
  res.render = function(page, content) {
    expect(page).to.eql('manage/user/forgot_password');
    expect(content.title).to.eql('Forgot Password');
    expect(content.passwordReset).to.eql(false);
    expect(content.userNotFound).to.eql(true);
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        '../../../API/manage/user-api.js': {
          forgotPassword: function (req, authCredentials, callback) {
            expect(authCredentials.username).to.eql(req.body.email);
            callback(null, false, true);
          }
        }
      });

  controller.forgotPassword(req, res, null);

  t.end();
});

test('forgotPassword when error', function(t) {

  var req = {
    body: {
      email: "test@test.com"
    }
  };
  var res = {};

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        '../../../API/manage/user-api.js': {
          forgotPassword: function (req, authCredentials, callback) {
            expect(authCredentials.username).to.eql(req.body.email);
            callback(new Error("I made forgot password fail"), null, null);
          }
        },
        '../../../helpers/common.js': {
          redirectToError: function (response) {
            expect(res).to.eql(response);
          }
        }
      });

  controller.forgotPassword(req, res, null);

  t.end();
});

test('changePassword', function(t) {
  var username = "test@test.com";
  var userId = "prsn1234";

  var req = {
    body: {
      oldPassword : "test1234",
      newPassword : "test2345"
    },
    session : {
      sessionData : {
        authToken : authToken,
        passwordChangeAuthUsername: username,
        passwordChangeAuthUserId: userId
      }
    }
  };

  var authUser = {
    authToken : authToken,
    user : {
      id : userId,
      username: username,
      person: {
        firstName : "Joseph"
      }
    },
    passwordChangeRequired: false
  };

  var res = {
    status : function (status) {
      expect(status).to.eql(200);
      return {
        send : function () {
          expect(req.session.sessionData["pwChangeResult"]).to.eq("success");
        }
      }
    }
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        '../../../API/manage/user-api.js': {
          changeUserPassword: function (req, pwChangeCredentials, userId, callback) {
            expect(pwChangeCredentials.username).to.eql(username);
            expect(pwChangeCredentials.password).to.eql(req.body.oldPassword);
            expect(pwChangeCredentials.newPassword).to.eql(req.body.newPassword);
            callback(null, 204);
          }
        },
        '../../../API/authentication-api.js' : {
          loginUser: function (req, res, authCredentials, cb) {
            expect(authCredentials.username).to.eql(username);
            expect(authCredentials.password).to.eql(req.body.newPassword);
            cb(null, authUser);
          },
          encryptPassword: function(pw) {
            expect(pw).to.not.be.null;
            return pw;
          }
        }
      });

  controller.changePassword(req, res, null);

  t.end();
});

test('changePassword user not found', function(t) {
  var username = "test@test.com";
  var userId = "prsn1234";

  var req = {
    body: {
      oldPassword : "test1234",
      newPassword : "test2345"
    },
    session : {
      sessionData : {
        authToken : authToken,
        passwordChangeAuthUsername: username,
        passwordChangeAuthUserId: userId
      }
    }
  };


  var res = {
    status : function (status) {
      expect(status).to.eql(401);
      return {
        send : function (errorObject) {
          expect(req.session.sessionData["pwChangeResult"]).to.be.undefined;
          expect(errorObject.error).to.eq("Username or password incorrect, please try again");
        }
      }
    }
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        '../../../API/manage/user-api.js': {
          changeUserPassword: function (req, pwChangeCredentials, userId, callback) {
            expect(pwChangeCredentials.username).to.eql(username);
            expect(pwChangeCredentials.password).to.eql(req.body.oldPassword);
            expect(pwChangeCredentials.newPassword).to.eql(req.body.newPassword);
            callback(new Error("Cannot find username/password"), 401);
          }
        },
        '../../../API/authentication-api.js' : {
          encryptPassword: function(pw) {
            expect(pw).to.not.be.null;
            return pw;
          }
        }
      });

  controller.changePassword(req, res, null);

  t.end();
});

test('changePassword reused password', function(t) {
  var username = "test@test.com";
  var userId = "prsn1234";

  var req = {
    body: {
      oldPassword : "test1234",
      newPassword : "test2345"
    },
    session : {
      sessionData : {
        authToken : authToken,
        passwordChangeAuthUsername: username,
        passwordChangeAuthUserId: userId
      }
    }
  };


  var res = {
    status : function (status) {
      expect(status).to.eql(409);
      return {
        send : function (errorObject) {
          expect(req.session.sessionData["pwChangeResult"]).to.be.undefined;
          expect(errorObject.error).to.eq("Previously used passwords cannot be reused, please try again");
        }
      }
    }
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        '../../../API/manage/user-api.js': {
          changeUserPassword: function (req, pwChangeCredentials, userId, callback) {
            expect(pwChangeCredentials.username).to.eql(username);
            expect(pwChangeCredentials.password).to.eql(req.body.oldPassword);
            expect(pwChangeCredentials.newPassword).to.eql(req.body.newPassword);
            callback(new Error("Cannot reuse password"), 409);
          }
        },
        '../../../API/authentication-api.js' : {
          encryptPassword: function(pw) {
            expect(pw).to.not.be.null;
            return pw;
          }
        }
      });

  controller.changePassword(req, res, null);

  t.end();
});

test('changePassword other error', function(t) {
  var username = "test@test.com";
  var userId = "prsn1234";

  var req = {
    body: {
      oldPassword : "test1234",
      newPassword : "test2345"
    },
    session : {
      sessionData : {
        authToken : authToken,
        passwordChangeAuthUsername: username,
        passwordChangeAuthUserId: userId
      }
    }
  };


  var res = {
    status : function (status) {
      expect(status).to.eql(400);
      return {
        send : function (errorObject) {
          expect(req.session.sessionData["pwChangeResult"]).to.be.undefined;
          expect(errorObject.error).to.eq("There was an issue with your request. Please try again in a few minutes");
        }
      }
    }
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        '../../../API/manage/user-api.js': {
          changeUserPassword: function (req, pwChangeCredentials, userId, callback) {
            expect(pwChangeCredentials.username).to.eql(username);
            expect(pwChangeCredentials.password).to.eql(req.body.oldPassword);
            expect(pwChangeCredentials.newPassword).to.eql(req.body.newPassword);
            callback(new Error("Intentional Error"), 400);
          }
        },
        '../../../API/authentication-api.js' : {
          encryptPassword: function(pw) {
            expect(pw).to.not.be.null;
            return pw;
          }
        }
      });

  controller.changePassword(req, res, null);

  t.end();
});






test('updateUser', function(t) {

  var userId = "pers12345";
  var username = "test.user@test.com";

  var originalUser = {
    id: userId,
    username: username,
    person: {
      primaryAddress: {}
    }
  };

  var updatedUser = JSON.parse(JSON.stringify(originalUser));

  var sessionData = {
    authToken: authToken,
    user : originalUser
  };

  var body = {
    firstName : "Joe",
    middleName : "The",
    lastName : "Tester",
    lastFourSSN : "5555",
    phone : "5555555555",
    dateOfBirth : "03/15/2016",
    street : "55 Test Way",
    suite : "Suite 5",
    city : "Test City",
    state : "UT",
    zip : "55555",
    timezoneId : "123"
  };

  var req = {
    body : body,
    session : {
      sessionData: sessionData
    }
  };

  var formattedDateOfBirth = "20160315";

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/manage/session-api.js": {
          setSessionData: function (req, key, value) {
            if (!req.session.sessionData){
              req.session.sessionData = {};
            }
            req.session.sessionData[key] = value;
          }
        },
        "../../../API/manage/user-api.js": {
          updateUser: function (req, userData, cb) {

            expect(userData.id).to.eql(userId);
            expect(userData.username).to.eql(username);
            expect(userData.person.firstName).to.eql(req.body.firstName);
            expect(userData.person.middleName).to.eql(req.body.middleName);
            expect(userData.person.lastName).to.eql(req.body.lastName);
            expect(userData.person.primaryPhone).to.eql(req.body.phone);
            expect(userData.person.primaryAddress.address1).to.eql(req.body.street);
            expect(userData.person.primaryAddress.address2).to.eql(req.body.suite);
            expect(userData.person.primaryAddress.city).to.eql(req.body.city);
            expect(userData.person.primaryAddress.state).to.eql(req.body.state);
            expect(userData.person.primaryAddress.postalCode).to.eql(req.body.zip);
            expect(userData.person.dateOfBirth).to.eql(formattedDateOfBirth);
            expect(userData.timezoneId).to.eql(req.body.timezoneId);

            var result = {
              updatedUser : updatedUser,
              generalError : false,
              validationErrors : null
            };

            cb(null, result);
            return;
          }
        }
      });

  var res = {
    status : function (status) {
      expect(status).to.eql(200);
      return {
        send : function () {
          // verify the data in session
          expect(sessionData.user).to.eql(updatedUser);
          expect(sessionData.isSuccessfulUserUpdate).to.eql(true);
        }
      }
    }
  };

  controller.updateUser(req, res, null);

  t.end();
});

test('updateUser handles validation errors', function(t) {

  var userId = "pers12345";
  var username = "test.user@test.com";

  var originalUser = {
    id: userId,
    username: username,
    person: {
      primaryAddress: {}
    }
  };

  var sessionData = {
    authToken: authToken,
    user : originalUser
  };

  var body = {
    firstName : "Joe",
    middleName : "The",
    lastName : "Tester",
    lastFourSSN : "5555",
    phone : "5555555555",
    dateOfBirth : "03/15/2016",
    street : "55 Test Way",
    suite : "Suite 5",
    city : "Test City",
    state : "UT",
    zip : "55555",
    timezoneId : "123"
  };

  var req = {
    body : body,
    session : {
      sessionData: sessionData
    }
  };

  var formattedDateOfBirth = "20160315";

  var validationErrors = {
    firstName : "Invalid first name"
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/manage/session-api.js": {
          setSessionData: function (req, key, value) {
            if (!req.session.sessionData){
              req.session.sessionData = {};
            }
            req.session.sessionData[key] = value;
          }
        },
        "../../../API/manage/user-api.js": {
          updateUser: function (req, userData, cb) {

            expect(userData.id).to.eql(userId);
            expect(userData.username).to.eql(username);
            expect(userData.person.firstName).to.eql(req.body.firstName);
            expect(userData.person.middleName).to.eql(req.body.middleName);
            expect(userData.person.lastName).to.eql(req.body.lastName);
            expect(userData.person.primaryPhone).to.eql(req.body.phone);
            expect(userData.person.primaryAddress.address1).to.eql(req.body.street);
            expect(userData.person.primaryAddress.address2).to.eql(req.body.suite);
            expect(userData.person.primaryAddress.city).to.eql(req.body.city);
            expect(userData.person.primaryAddress.state).to.eql(req.body.state);
            expect(userData.person.primaryAddress.postalCode).to.eql(req.body.zip);
            expect(userData.person.dateOfBirth).to.eql(formattedDateOfBirth);
            expect(userData.timezoneId).to.eql(req.body.timezoneId);

            var result = {
              updatedUser : null,
              generalError : false,
              validationErrors : validationErrors
            };

            cb(new Error("I made update user test fail"), result);
            return;
          }
        }
      });

  var res = {
    status : function (status) {
      expect(status).to.eql(400);
      return {
        send : function (result) {
          // verify the data in session
          expect(sessionData.user).to.eql(originalUser);
          expect(sessionData.isSuccessfulUserUpdate).to.be.undefined;
          expect(result.validationErrors).to.eql(validationErrors);
        }
      }
    }
  };

  controller.updateUser(req, res, null);

  t.end();
});

test('updateUser handles general error', function(t) {

  var userId = "pers12345";
  var username = "test.user@test.com";

  var originalUser = {
    id: userId,
    username: username,
    person: {
      primaryAddress: {}
    }
  };

  var sessionData = {
    authToken: authToken,
    user : originalUser
  };

  var body = {
    firstName : "Joe",
    middleName : "The",
    lastName : "Tester",
    lastFourSSN : "5555",
    phone : "5555555555",
    dateOfBirth : "03/15/2016",
    street : "55 Test Way",
    suite : "Suite 5",
    city : "Test City",
    state : "UT",
    zip : "55555",
    timezoneId : "123"
  };

  var req = {
    body : body,
    session : {
      sessionData: sessionData
    }
  };

  var formattedDateOfBirth = "20160315";

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/manage/session-api.js": {
          setSessionData: function (req, key, value) {
            if (!req.session.sessionData){
              req.session.sessionData = {};
            }
            req.session.sessionData[key] = value;
          }
        },
        "../../../API/manage/user-api.js": {
          updateUser: function (req, userData, cb) {

            expect(userData.id).to.eql(userId);
            expect(userData.username).to.eql(username);
            expect(userData.person.firstName).to.eql(req.body.firstName);
            expect(userData.person.middleName).to.eql(req.body.middleName);
            expect(userData.person.lastName).to.eql(req.body.lastName);
            expect(userData.person.primaryPhone).to.eql(req.body.phone);
            expect(userData.person.primaryAddress.address1).to.eql(req.body.street);
            expect(userData.person.primaryAddress.address2).to.eql(req.body.suite);
            expect(userData.person.primaryAddress.city).to.eql(req.body.city);
            expect(userData.person.primaryAddress.state).to.eql(req.body.state);
            expect(userData.person.primaryAddress.postalCode).to.eql(req.body.zip);
            expect(userData.person.dateOfBirth).to.eql(formattedDateOfBirth);
            expect(userData.timezoneId).to.eql(req.body.timezoneId);

            var result = {
              updatedUser : null,
              generalError : true,
              validationErrors : null
            };

            cb(new Error("I made update user test fail"), result);
            return;
          }
        }
      });

  var res = {
    status : function (status) {
      expect(status).to.eql(500);
      return {
        send : function (result) {
          // verify the data in session
          expect(sessionData.user).to.eql(originalUser);
          expect(sessionData.isSuccessfulUserUpdate).to.be.undefined;
          expect(result.error).to.be.not.null;
        }
      }
    }
  };

  controller.updateUser(req, res, null);

  t.end();
});