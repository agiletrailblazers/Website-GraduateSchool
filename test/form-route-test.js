var chai = require('chai');
var expect = require('chai').expect;
var contentful_forms = require("../API/contentful_forms.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;

test('form route test for inquiry form', function(t) {
var contentfulformServer = nock('https://cdn.contentful.com')
    .get('/spaces/tz32dajhh9bn/entries/80IOLAFnVuYGk6U4ocooC/?access_token=093001a794ab16e4bf8ec4f7bc6740de4f267bc49549020ea3befbd5164754af')
    .reply(200, {
        'accept': 'application/json', "fields": {
                "howDidYouHearAboutTraining": [
                    {
                        "name": "From a GS training officer."
                    },
                ],
    "title": "Training at Your Location"
    }
    });
contentfulformServer;
contentful_forms.getInquiryForm(function(response){
    hearAboutTrainingString = 'From a GS training officer.';
    console.log(response.fields.title);
    expect(response.fields.howDidYouHearAboutTraining[0].name).to.equal(hearAboutTrainingString);
    expect(response).to.be.a('object');
});
t.end();
});

test('form route test for Contact us', function(t) {
var contentfulformServer = nock('https://cdn.contentful.com')
    .get('/spaces/tz32dajhh9bn/entries/6Av0MIjzZC2qIsGKUGyKS0?access_token=093001a794ab16e4bf8ec4f7bc6740de4f267bc49549020ea3befbd5164754af')
.reply(200, {
        'accept': 'application/json',
    "fields": {
        "title": "Contact Us",
    }
    });
contentfulformServer;
contentful_forms.getContactUs(function(response){
    fieldsTitle ="Contact Us";
   expect(response.cmsEntry.fields.title).to.equal(fieldsTitle);
    expect(response).to.be.a('object');
});
t.end();
});

