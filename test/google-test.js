var chai = require('chai');
var expect = require('chai').expect;
var contentful_forms = require("../API/google.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;

test('test for google capticha', function(t) {
    var googleRecaptchaServer = nock('https://www.google.com',{allowUnmocked: true})
        .get('https://www.google.com/recaptcha/api/siteverify?secret=6Lfj4AsTAAAAAE0Bpvzcdxdg-dRvfAaS6ZI8_Duc&response=')
        .reply(200, {
        },'');
    googleRecaptchaServer;
    contentful_forms.verifyCaptcha(function(response){
       expect(response.statusCode).to.eql(200);
    },'');
    t.end();
});
