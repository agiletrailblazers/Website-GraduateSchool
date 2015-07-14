var chai = require('chai');
var expect = require('chai').expect;
var contentful = require('../API/contentful.js');
var homepg = require('../API/tester.js');


 describe ('homepage', function() {
   it('returns lowercase of a string', function(){
     var inputword='Welcome to the Graduate School Home Page';
     var outputword = homepg.landingPage(inputword);
     expect(outputword).to.equal('welcome to the graduate school home page');
   });
 });
 describe('whats-new', function() {
   var goodStatus = "200"
   contenful.getWhatsNew(function(response){
    //  Expect api status to return 200 and not 404 or 500.
   })
 });
