var session = require('../API/manage/session-api.js');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var test = require('tap').test;

test('get session data value success', function(t) {
    var req = {
        session : {
            sessionData : {
                foo: "bar",
                bar: "foo"
            }
        }
    };

    expect(session.getSessionData(req, "foo")).to.eql("bar");
    expect(session.getSessionData(req, "bar")).to.eql("foo");
    
    t.end();
});

test('get session data when sessionData object does not exist', function(t) {
    var req = {
        session : {
        }
    };

    expect(req.session.sessionData).to.be.undefined;
    expect(session.getSessionData(req, "foo")).to.be.undefined;
    expect(session.getSessionData(req, "bar")).to.be.undefined;
    expect(req.session.sessionData).to.eql({});

    t.end();
});

test('get session data value when sessionData exists but key does not exist', function(t) {
    var req = {
        session : {
            sessionData : {}
        }
    };

    expect(req.session.sessionData).to.eql({});
    expect(session.getSessionData(req, "foo")).to.be.undefined;
    expect(session.getSessionData(req, "bar")).to.be.undefined;
    expect(req.session.sessionData).to.eql({});

    t.end();
});

test('get session data when session object does not exist', function(t) {
    var req = {
    };

    expect(req.session).to.be.undefined;
    expect(session.getSessionData(req, "foo")).to.be.undefined;
    expect(session.getSessionData(req, "bar")).to.be.undefined;

    t.end();
});

test('set session data value to existing sessionData object and existing key ', function(t) {
    var req = {
        session : {
            sessionData : {
                foo: "bar",
                bar: "foo"
            }
        }
    };

    expect(req.session.sessionData.foo).to.eql("bar");
    expect(req.session.sessionData.bar).to.eql("foo");

    session.setSessionData(req, "foo", "changed");
    expect(req.session.sessionData.foo).to.eql("changed");
    expect(req.session.sessionData.bar).to.eql("foo");

    t.end();
});

test('set session data value to existing sessionData object and new key ', function(t) {
    var req = {
        session : {
            sessionData : {
                foo: "bar",
                bar: "foo"
            }
        }
    };

    expect(req.session.sessionData.foo).to.eql("bar");
    expect(req.session.sessionData.bar).to.eql("foo");
    expect(req.session.sessionData.newKey).to.be.undefined;

    session.setSessionData(req, "newKey", "New Key Value");
    expect(req.session.sessionData.foo).to.eql("bar");
    expect(req.session.sessionData.bar).to.eql("foo");
    expect(req.session.sessionData.newKey).to.eql("New Key Value");

    t.end();
});

test('set session data value to new sessionData object and new key ', function(t) {
    var req = {
        session : {}
    };

    expect(req.session.sessionData).to.be.undefined;

    session.setSessionData(req, "newKey", "New Key Value");
    expect(req.session.sessionData.newKey).to.eql("New Key Value");

    t.end();
});

test('clear session data success', function(t) {
    var req = {
        session : {
            sessionData : {
                foo: "bar",
                bar: "foo"
            }
        }
    };

    expect(req.session.sessionData.foo).to.eql("bar");
    expect(req.session.sessionData.bar).to.eql("foo");

    session.clearSessionData(req);

    expect(req.session.sessionData).to.eql({});
    expect(req.session.sessionData.foo).to.be.undefined;
    expect(req.session.sessionData.bar).to.be.undefined;

    t.end();
});