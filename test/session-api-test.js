var session = require('../API/manage/session-api.js');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;
var proxyquire = require('proxyquire').noCallThru();

test('cacheDisabled - set session data success', function(t) {
    var req = {};
    var apiController = proxyquire('../API/manage/session-api.js', {
        "konphyg": function (configPath) {
            var configFile = function (configName) {
                expect(configName).to.eql("properties");
                var config = {
                    manage : {
                        useCache: false,
                        sessionName: "gssession"
                    }
                };
                return config;
            };
            return configFile;
        }
    });
  var sessionData = {
    data1 : "foo",
    data2 : "bar"
  };

  // setup our mock response object
  var res = {
    cookie: function(name, value, props) {
      var actualSessionData = JSON.parse(value);
      expect(actualSessionData.data1).to.eql(sessionData.data1);
      expect(actualSessionData.data2).to.eql(sessionData.data2);
      expect(actualSessionData.lastUpdated).to.exist;
    }
  };

  // call the object under test
  apiController.setSessionData(req, res, sessionData);

  t.end();
 });

test('cacheDisabled - get session data empty success', function(t) {
    var apiController = proxyquire('../API/manage/session-api.js', {
        "konphyg": function (configPath) {
            var configFile = function (configName) {
                expect(configName).to.eql("properties");
                var config = {
                    manage : {
                        useCache: false,
                        sessionName: "gssession"
                    }
                };
                return config;
            };
            return configFile;
        }
    });
   // setup our mock request object
   var req = {
     cookies: {}
   };

   // call the object under test
   apiController.getSessionData(req,function(error, sessionData) {
        expect(sessionData).to.eql({});
        expect(error).to.eql(null)
    });

   t.end();
});

test('cacheDisabled - get session data success', function(t) {
    var apiController = proxyquire('../API/manage/session-api.js', {
        "konphyg": function (configPath) {
            var configFile = function (configName) {
                expect(configName).to.eql("properties");
                var config = {
                    manage : {
                        useCache: false,
                        sessionName: "gssession"
                    }
                };
                return config;
            };
            return configFile;
        }
    });
  // setup our mock request object
  var gssessionObj = {
    lastUpdated: 123456,
    data1: "foo"
  };

  var req = {
    cookies: {
      gssession: JSON.stringify(gssessionObj)
    }
  };

    // call the object under test
    apiController.getSessionData(req,function(error, sessionData) {
        expect(sessionData).to.eql(gssessionObj);
        expect(error).to.eql(null)
    });

   t.end();
  });

test('cacheEnabled - get session success with no key', function(t) {
    var apiController = proxyquire('../API/manage/session-api.js', {
        "konphyg": function (configPath) {
            var configFile = function (configName) {
                expect(configName).to.eql("properties");
                var config = {
                    manage : {
                        useCache: true,
                        sessionName: "gssession"
                    }
                };
                return config;
            };
            return configFile;
        }
    });
    var req = {
        cookies: {}
    };
    var expectedSessionData = {};
    apiController.getSessionData(req, function(error, sessionData) {
        expect(sessionData).to.eql(expectedSessionData);
    });

    t.end();
});

test('cacheEnabled - get session with key success', function(t) {
    var expectedSessionKey = "abc123";
    var expectedSessionData = {
        foo: "bar",
        bar: "foo"
    };
    var cache = {};
    cache.get = function(key, callback){
        expect(key).to.eql(expectedSessionKey);
        callback(null, JSON.stringify(expectedSessionData));
    };
    var apiController = proxyquire('../API/manage/session-api.js', {
        "konphyg": function (configPath) {
            var configFile = function (configName) {
                expect(configName).to.eql("properties");
                var config = {
                    manage : {
                        useCache: true,
                        sessionName: "gssession"
                    }
                };
                return config;
            };
            return configFile;
        }
    });
    var req = {
        cookies: {
            gssession: expectedSessionKey
        },
        app: {
            cache: cache
        }
    };

    req.app.get = function(parameter) {
        expect(parameter).to.eql('cache');
        return cache;
    };

    apiController.getSessionData(req, function(error, sessionData) {
        expect(sessionData).to.eql(expectedSessionData);
    });

    t.end();
});

test('cacheEnabled - get session with no cache success', function(t) {
    var expectedSessionKey = "abc123";
    var apiController = proxyquire('../API/manage/session-api.js', {
        "konphyg": function (configPath) {
            var configFile = function (configName) {
                expect(configName).to.eql("properties");
                var config = {
                    manage : {
                        useCache: true,
                        sessionName: "gssession"
                    }
                };
                return config;
            };
            return configFile;
        }
    });
    var req = {
        cookies: {
            gssession: expectedSessionKey
        },
        app: {}
    };
    req.app.get = function(parameter) {
        expect(parameter).to.eql('cache');
        return null;
    };

    apiController.getSessionData(req, function(error, sessionData) {
        expect(sessionData).to.eql({});
    });
    t.end();
});

test('cacheEnabled - get session error', function(t) {
    var expectedSessionKey = "abc123";
    var expectedSessionData = {
        foo: "bar",
        bar: "foo"
    };
    var cache = {};
    cache.get = function(key, callback){
        expect(key).to.eql(expectedSessionKey);
        callback(new Error("Intentional test failure"), null);
    };
    var apiController = proxyquire('../API/manage/session-api.js', {
        "konphyg": function (configPath) {
            var configFile = function (configName) {
                expect(configName).to.eql("properties");
                var config = {
                    manage : {
                        useCache: true,
                        sessionName: "gssession"
                    }
                };
                return config;
            };
            return configFile;
        }
    });
    var req = {
        cookies: {
            gssession: expectedSessionKey
        },
        app: {
            cache: cache
        }
    };

    req.app.get = function(parameter) {
        expect(parameter).to.eql('cache');
        return cache;
    };

    apiController.getSessionData(req, function(error, sessionData) {
        expect(error).to.be.an.instanceof(Error);
        expect(sessionData).to.eql({});
    });
    t.end();
});

test('cacheEnabled - setSession success no key cookie', function(t) {
    var expectedSessionName = "gssession";
    var cache = {};
    var expectedSessionData = {
        foo: "bar",
        bar: "foo"
    };
    cache.set = function(key, dataString){
        //expect(key).to.eql(expectedSessionKey); //This should be a new uuid in this context?
        expect(key).to.exist;
        expect(dataString).to.eql(JSON.stringify(expectedSessionData));
    };
    var apiController = proxyquire('../API/manage/session-api.js', {
        "konphyg": function (configPath) {
            var configFile = function (configName) {
                expect(configName).to.eql("properties");
                var config = {
                    manage : {
                        useCache: true,
                        sessionName: expectedSessionName
                    }
                };
                return config;
            };
            return configFile;
        }
    });
    var req = {
        cookies: {},
        app: {
            cache: cache
        }
    };
    req.app.set = function(name, value) {
        expect(name).to.eql("sessionData");
        expect(value).to.eql(expectedSessionData);
    };
    var res = {
        cookie: function(name, value) {
            expect(name).to.eql(expectedSessionName);
            expect(value).to.exist;
        }
    };

    req.app.get = function(parameter) {
        expect(parameter).to.eql('cache');
        return cache;
    };
    apiController.setSessionData(req, res, expectedSessionData);
    t.end();
});

test('cacheEnabled - setSession success with key cookie', function(t) {
    var expectedSessionKey = "abc123";
    var expectedSessionName = "gssession";
    var cache = {};
    var expectedSessionData = {
        foo: "bar",
        bar: "foo"
    };
    cache.set = function(key, dataString){
        //expect(key).to.eql(expectedSessionKey); //This should be a new uuid in this context?
        expect(key).to.eql(expectedSessionKey);
        expect(dataString).to.eql(JSON.stringify(expectedSessionData));
    };
    var apiController = proxyquire('../API/manage/session-api.js', {
        "konphyg": function (configPath) {
            var configFile = function (configName) {
                expect(configName).to.eql("properties");
                var config = {
                    manage : {
                        useCache: true,
                        sessionName: expectedSessionName
                    }
                };
                return config;
            };
            return configFile;
        }
    });
    var req = {
        cookies: {
            gssession: expectedSessionKey
        },
        app: {
            cache: cache
        }
    };
    var res = {
        cookie: function(name, value) {
            expect(name).to.eql(expectedSessionName);
            expect(value).to.eql(expectedSessionKey);
        }
    };
    req.app.set = function(name, value) {
        expect(name).to.eql("sessionData");
        expect(value).to.eql(expectedSessionData);
    };
    req.app.get = function(parameter) {
        expect(parameter).to.eql('cache');
        return cache;
    };
    apiController.setSessionData(req, res, expectedSessionData);
    t.end();
});

test('cacheEnabled - delete session', function(t) {
    var expectedSessionKey = "abc123";
    var expectedSessionName = "gssession";
    var cache = {};
    cache.del = function(key){
        expect(key).to.eql(expectedSessionKey);
    };
    var apiController = proxyquire('../API/manage/session-api.js', {
        "konphyg": function (configPath) {
            var configFile = function (configName) {
                expect(configName).to.eql("properties");
                var config = {
                    manage : {
                        useCache: true,
                        sessionName: expectedSessionName
                    }
                };
                return config;
            };
            return configFile;
        }
    });
    var req = {
        app: {
            cache: cache
        }
    };
    req.app.get = function(parameter) {
        expect(parameter).to.eql('cache');
        return cache;
    };
    apiController.deleteSessionData(req, expectedSessionKey);

    t.end();
});

test('cacheEnabled - setLogin success', function(t) {
    var expectedEnvironment = "testing";
    var expectedSessionName = "gssession";
    var originalSessionKey = "abc123";
    var expectedUserId = "persn001";

    var cache = {};
    cache.set = function(key, dataString){
        expect(key).to.eql(expectedUserId + expectedEnvironment);
        var parsedDataString = JSON.parse(dataString);
        expect(parsedDataString.userId).to.eql(sessionData.userId);
    };
    cache.del = function(key){
        expect(key).to.eql(originalSessionKey);
    };
    var sessionData = {
        userId : expectedUserId
    };
    var req = {
        cookies: {
            gssession : originalSessionKey
        },
        app: {
            cache: cache
        }
    };
    req.app.set = function(name, value) {
        expect(name).to.eql("sessionData");
        expect(value.userId).to.eql(sessionData.userId);
        expect(value.lastUpdated).to.exist;
    };
    req.app.get = function(parameter) {
        expect(parameter).to.eql('cache');
        return cache;
    };
    var res = {
        cookie: function(name, value) {
            expect(name).to.eql(expectedSessionName);
            expect(value).to.eql(expectedUserId + expectedEnvironment);
        }
    };
    var apiController = proxyquire('../API/manage/session-api.js', {
        "konphyg": function (configPath) {
            var configFile = function (configName) {
                expect(configName).to.eql("properties");
                var config = {
                    env: expectedEnvironment,
                    manage : {
                        useCache: true,
                        sessionName: expectedSessionName
                    }
                };
                return config;
            };
            return configFile;
        }
    });

    apiController.setLoggedInUserSession(req, res, sessionData);
    t.end();
});

test('cacheEnabled - logout success', function(t) {
    var expectedSessionKey = "abc123";
    var expectedSessionName = "gssession";
    var req = {
        cookies: {
            gssession: expectedSessionKey
        },
        app: {}
    };
    var res = {
        cookie: function(name, value, props ) {
            expect(name).to.eql(expectedSessionName);
            expect(value).to.eql(null);
            should.exist(props["expires"]); //Cannot test exact time as it is the current time
        }
    };
    req.app.set = function(name, value) {
        expect(name).to.eql("sessionData");
        expect(value).to.eql({});
    };
    var apiController = proxyquire('../API/manage/session-api.js', {
        "konphyg": function (configPath) {
            var configFile = function (configName) {
                expect(configName).to.eql("properties");
                var config = {
                    manage : {
                        useCache: true,
                        sessionName: expectedSessionName
                    }
                };
                return config;
            };
            return configFile;
        }
    });
    apiController.logoutUserSession(req, res);

    t.end();
})
