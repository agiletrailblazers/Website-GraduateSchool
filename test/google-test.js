var chai = require('chai');
var expect = require('chai').expect;
var contentful_forms = require("../API/google.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;

test('test for google captcha:success', function(t) {
    var googleRecaptchaServer = nock('https://www.google.com')
        .post('/recaptcha/api/siteverify?secret=6Lfj4AsTAAAAAE0Bpvzcdxdg-dRvfAaS6ZI8_Duc&response=')
        .reply(200, {
        },'');
    googleRecaptchaServer;
    contentful_forms.verifyCaptcha(function(response){
       expect(response.statusCode).to.eql(200);
    },'');
    t.end();
});

test('test for google captcha:error', function(t) {
    var googleRecaptchaServer = nock('https://www.google.com')
        .post('/recaptcha/api/siteverify?secret=6Lfj4AsTAAAAAE0Bpvzcdxdg-dRvfAaS6ZI8_Duc&response=')
        .reply(500, {"success":false, "error-codes":["invalid-input-response"]
        },'');
    googleRecaptchaServer;
    contentful_forms.verifyCaptcha(function(response){
       expect(response.statusCode).to.eql(500);
       expect(response.body).to.eq('{"success":false,"error-codes":["invalid-input-response"]}');
    },'');
    t.end();
});
