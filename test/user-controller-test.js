var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire').noCallThru();

test('loginCreate', function(t) {

  var req, res = {};
  var expectedStates = ['Alaska'];
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
    "../../../API/manage/session-api.js": {
      getSessionData: function (req) {
        return sessionData;
      },
      setSessionData: function (res, data) {
        // verify data passed in
        expect(data).to.eql(sessionData);
      }    }
  });

  res.render = function(page, content) {
      expect(page).to.eql('manage/user/loginCreate');
      expect(content.title).to.eql('Login');
      expect(content.states[0]).to.eql(expectedStates[0]);
      expect(content.sessionId).to.eql(sessionData.cart.sessionId);
  };

  controller.displayLoginCreate(req, res, null);

  t.end();
});

test('loginCreate handles error', function(t) {

  var req, res = {};
  var sessionData = {
    cart : {
      sessionId : "12345"
    }
  };
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
      getSessionData: function (req) {
        return sessionData;
      },
      setSessionData: function (res, data) {
        // verify data passed in
        expect(data).to.eql(sessionData);
      }
    }
  });

  controller.displayLoginCreate(req, res, null);

  t.end();
});

test('login', function(t) {

  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    }
  };

  var sessionData = {
  };

  var authUser = {
      user : {
        id : "pers12345"
      }
  }

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
  {
    "../../../API/manage/session-api.js": {
      getSessionData: function (req) {
        return sessionData;
      },
      setSessionData: function (res, data) {
        // verify data passed in
        expect(data.userId).to.eql(authUser.user.id);
      }
    },
    '../../../API/authentication-api.js': {
      loginUser: function (req, res, authCredentials, cb) {
        expect(authCredentials.username).to.eql(req.body.username);
        expect(authCredentials.password).to.eql(req.body.password);
        cb(null, authUser);
      },
    }
  });

  res.redirect = function(page) {
      expect(page).to.eql('/manage/cart/payment');
  };

  controller.login(req, res, null);

  t.end();
});

test('login should handle error', function(t) {

  var res = {};
  var req = {
    body : {
      username : "user12345",
      password : "test1234"
    }
  };

  var userId = "pers12345";

  var sessionData = {
  };

  var authUser = {
      user : {
        id : userId
      }
  }

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
  {
    "../../../API/manage/session-api.js": {
      getSessionData: function (req) {
        return sessionData;
      },
      setSessionData: function (res, data) {
        // verify data passed in
        expect(data.loginError).to.eql("Login failed, please try again");
      }
    },

    '../../../API/authentication-api.js': {
      loginUser: function (req, res, authCredentials, cb) {
        expect(authCredentials.username).to.eql(req.body.username);
        expect(authCredentials.password).to.eql(req.body.password);
        cb(new Error("I am not the droid you are looking for"), authUser);
      },
    }
  });

  res.redirect = function(page) {
      expect(page).to.eql('loginCreate');
  };

  controller.login(req, res, null);

  t.end();
});

test('createUser', function(t) {

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
      city : "Test City",
      state : "UT",
      zip : "55555",
      birthMonth : "05",
      birthDay : "10",
      birthYear : "1955"
    },
    query : {
      authToken : "123456789123456789"
    }
  };

  var sessionData = {
  };
  var userId = "pers12345";
  var authUser = {
      user : {
        id : userId
      }
  }

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
  {
    "../../../API/manage/session-api.js": {
      getSessionData: function (req) {
        return sessionData;
      },
      setSessionData: function (res, data) {
        // verify data passed in
        expect(data.userId).to.eql(userId);
      }
    },
    "../../../API/manage/user-api.js": {
      createUser: function (userData, cb, authToken) {

        expect(userData.username).to.eql(req.body.email);
        expect(userData.password).to.eql(req.body.password);
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
        expect(userData.person.dateOfBirth).to.eql(req.body.birthMonth + "/" + req.body.birthDay + "/" + req.body.birthYear);

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
        expect(authCredentials.password).to.eql(req.body.password);
        cb(null, authUser);
      },
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

test('createUser handles create user error', function(t) {

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
      city : "Test City",
      state : "UT",
      zip : "55555",
      birthMonth : "05",
      birthDay : "10",
      birthYear : "1955"
    },
    query : {
      authToken : "123456789123456789"
    }
  };

  var sessionData = {
  };
  var userId = "pers12345";
  var authUser = {
      user : {
        id : userId
      }
  }

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
  {
    "../../../API/manage/session-api.js": {
      getSessionData: function (req) {
        return sessionData;
      },
      setSessionData: function (res, data) {
        // verify data passed in
        expect(data.userId).to.eql(userId);
      }
    },
    "../../../API/manage/user-api.js": {
      createUser: function (userData, cb, authToken) {

        expect(userData.username).to.eql(req.body.email);
        expect(userData.password).to.eql(req.body.password);
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
        expect(userData.person.dateOfBirth).to.eql(req.body.birthMonth + "/" + req.body.birthDay + "/" + req.body.birthYear);

        expect(authToken).to.eql(req.query.authToken);

        cb(new Error("Create user failed"));
        return;
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
      city : "Test City",
      state : "UT",
      zip : "55555",
      birthMonth : "05",
      birthDay : "10",
      birthYear : "1955"
    },
    query : {
      authToken : "123456789123456789"
    }
  };

  var sessionData = {
  };
  var userId = "pers12345";
  var authUser = {
      user : {
        id : userId
      }
  }

  // mock out our collaborators (i.e. the required libraries) so that we can verify behavior of our controller
  var controller = proxyquire('../router/routes/manage/user-controller.js',
  {
    "../../../API/manage/session-api.js": {
      getSessionData: function (req) {
        return sessionData;
      },
      setSessionData: function (res, data) {
        // verify data passed in
        expect(data.userId).to.eql(userId);
      }
    },
    "../../../API/manage/user-api.js": {
      createUser: function (userData, cb, authToken) {

        expect(userData.username).to.eql(req.body.email);
        expect(userData.password).to.eql(req.body.password);
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
        expect(userData.person.dateOfBirth).to.eql(req.body.birthMonth + "/" + req.body.birthDay + "/" + req.body.birthYear);

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
        expect(authCredentials.password).to.eql(req.body.password);
        cb(new Error("I man authentication fail"), null);
      },
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