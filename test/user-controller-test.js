var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');

var encryptedPassword = "encryptedPassword";

test('registrationLoginCreate', function(t) {
  var sessionData = {
    cart : {
      sessionId : "12345"
    }
  };

  var req = {
    query : {
      authToken : "123456789123456789"
    },
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
    "../../../API/manage/user-api.js": {
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
    cart : {
      sessionId : "12345"
    }
  };
  var req = {
    query : {
      authToken : "123456789123456789"
    },
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
    cart : {
      sessionId : "12345"
    }
  };
  var req = {
    query : {
      authToken : "123456789123456789"
    },
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
        "../../../API/manage/user-api.js": {
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
    query : {
      authToken : "123456789123456789"
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
        "../../../API/manage/user-api.js": {
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
  var expectedNextPage = "testpage"
  var req = {
    query : {
      authToken : "123456789123456789"
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
  var sessionData = {
    cart : {
      sessionId : "12345"
    }
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        "../../../API/contentful.js": {
          getReferenceData: function (slug, callback) {
            expect(slug).to.eql("us-states");
            callback(expectedStates, null);
          }
        },
        "../../../API/manage/user-api.js": {
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
    query : {
      authToken : "123456789123456789"
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
    query : {
      authToken : "123456789123456789"
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
        "../../../API/manage/user-api.js": {
          getTimezones: function (callback, authtoken) {
            callback(expectedError, null);
          }
        }
      });

  controller.displayCreateUser(req, res, null);

  t.end();
});

test('registrationLogin', function(t) {
  var sessionData = {
  };
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    query : {
      authToken: "123456789123456789"
    },
    session : {
      sessionData : sessionData
    }
  };

  var authUser = {
      user : {
        id : "pers12345",
        person: {
          firstName : "Joseph"
        }
      }
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

        if (key==="userId"){
          expect(value).to.eql(authUser.user.id);
          setSessionCheckedCounter++;
        } else if (key==="userFirstName"){
          expect(value).to.eql(authUser.user.person.firstName);
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
  };

  controller.registrationLogin(req, res, null);

  t.end();
});

test('registrationLogin should handle login failure', function(t) {
  var sessionData = {};
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    query : {
      authToken : "123456789123456789"
    },
    session : {
      sessionData : sessionData
    }
  };

  var userId = "pers12345";

  var authUser = {
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
  var sessionData = {};
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    query : {
      authToken : "123456789123456789"
    },
    session : {
      sessionData : sessionData
    }
  };

  var userId = "pers12345";

  var authUser = {
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
  var sessionData = {};
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
    query : {
      authToken : "123456789123456789"
    },
    session : {
      sessionData : sessionData
    }
  };

  var userId = "pers12345";
  var authUser = {
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

        expect(authToken).to.eql(req.query.authToken);

        // put an id in the user data and return it as created userData
        userData.id = userId;
        cb(null, userData);
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

test('createUser handles no dateOfBirth', function(t) {
  var sessionData = {};
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
    query : {
      authToken : "123456789123456789"
    },
    session : {
      sessionData : sessionData
    }
  };

  var userId = "pers12345";
  var authUser = {
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
            expect(userData.person.dateOfBirth).to.eql(null);

            expect(authToken).to.eql(req.query.authToken);

            cb(new Error("Create user failed"));
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

test('createUser handles create user error', function(t) {
  var sessionData = {};
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
    query : {
      authToken : "123456789123456789"
    },
    session : {
      sessionData : sessionData
    }
  };

  var userId = "pers12345";
  var authUser = {
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

        expect(authToken).to.eql(req.query.authToken);

        cb(new Error("Create user failed"));
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
  var sessionData = {};
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
    query : {
      authToken : "123456789123456789"
    },
    session : {
      sessionData : sessionData
    }
  };

  var userId = "pers12345";
  var authUser = {
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

        expect(authToken).to.eql(req.query.authToken);

        // put an id in the user data and return it as created userData
        userData.id = userId;
        cb(null, userData);
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
  var sessionData = {};
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    query : {
      authToken: "123456789123456789"
    },
    session : {
      sessionData : sessionData
    }
  };

  var authUser = {
    user : {
      id : "pers12345",
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
        }
      }
    }
  };

  controller.login(req, res, null);

  t.end();
});

test('login should handle failed login error', function(t) {
  var sessionData = {};
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    query : {
      authToken : "123456789123456789"
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
  var sessionData = {};
  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    },
    query : {
      authToken : "123456789123456789"
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
    userId: "user1234",
    userFirstName: "TestUser",
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
      gstoken: authToken,
      gssession: sessionData.userId
    },
    query: {
      "authToken": authToken
    },
    session : {
      sessionData : sessionData
    }
  };

  var res = {
    cookies: {
      gstoken: null,
      gssession: null
    }
  };

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
      {
        '../../../API/authentication-api.js': {
          logoutUser: function (req, res) {
            expect(req.cookies.gstoken).to.not.eql(res.cookies.gstoken);
          }
        }
      });

  res.redirect = function(page) {
    expect(page).to.eql('/');
  };

  controller.logout(req, res, null);

  expect(req.query["authToken"]).to.eql(null);

  t.end();
});

test('logoutAsync', function(t) {
  var authToken = "12345";
  var sessionData = {
    userId: "user1234",
    userFirstName: "TestUser",
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
      gstoken: authToken,
    },
    query: {
      "authToken": authToken
    },
    session : {
      sessionData : sessionData
    }
  };

  var res = {
    cookies: {
      gstoken: null,
    },
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
        '../../../API/authentication-api.js': {
          logoutUser: function (req, res) {
            expect(req.cookies.gstoken).to.not.eql(res.cookies.gstoken);
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
