var service = require("../helpers/ajax-form-route-service.js");
var test = require('tap').test;


test('ajaxform-service-test:online-inquiry:all success', function(t) {
	var names = {firstName:"Fred",lastName:"Smith",organization:"GraduateSchool"};
	var communiation = {email:"akumari@agiletrailblazer.com", phone: "2025076316"};
	var studCount = {studentCount:"4"};
    var params = {address:names, contact:communiation, course:studCount,hearAbout:"Internet",captchaResponse:"selected"};
    service.validateOnsiteInquiryfields(function(response){
    },params);
    t.end();
});


test('ajaxform-service-test:online-inquiry:all empty', function(t) {
	var names = {firstName:"",lastName:"",organization:""};
	var communiation = {email:"", phone: ""};
	var studCount = {studentCount:""};
    var params = {address:names, contact:communiation, course:studCount,hearAbout:"",captchaResponse:""};
    service.validateOnsiteInquiryfields(function(response){
    },params);
    t.end();
});

test('ajaxform-service-test:online-inquiry:error tests', function(t) {
	var names = {firstName:"Fr",lastName:"Sm",organization:"Gr"};
	var communiation = {email:"err", phone: "78"};
	var studCount = {studentCount:""};
    var params = {address:names, contact:communiation, course:studCount,hearAbout:"no",captchaResponse:""};
    service.validateOnsiteInquiryfields(function(response){
    },params);
    t.end();
});
