var commonAPI = require('../API/common-api.js');
var request = require('request');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var config = require('konphyg')(__dirname + "/../config");
var test = require('tap').test;

var authToken = "token123456789";

test('get timezones success', function(t) {
    //use endpoint from config even for tests
    var apiServer = config("properties").apiServer;

    var id1 = "1234";
    var name1 = "EASTERN";
    var id2 = "5678";
    var name2 = "CENTRAL";

    var timezoneData = [
        {
            "id": id1,
            "name": name1
        },
        {
            "id": id2,
            "name": name2
        }
    ];

    //test a 200 ok
    var server = nock(apiServer, {
        reqheaders: {
            'Authorization': authToken
        }
    })
        .get('/api/common/timezones')
        .reply(200, timezoneData);

    server;
    commonAPI.getTimezones(function(error, retrievedTimezones, body) {
        server.done();
        expect(retrievedTimezones[0].id).to.eql(id1);
        expect(retrievedTimezones[0].name).to.eql(name1);
        expect(retrievedTimezones[1].id).to.eql(id2);
        expect(retrievedTimezones[1].name).to.eql(name2);
        expect(retrievedTimezones).to.eql(timezoneData);
    }, authToken);

    t.end();
});