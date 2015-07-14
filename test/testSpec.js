var chai=require('chai');
var expect=require('chai').expect;

var homepg=require('../API/tester.js');

 describe ('homepage', function(){
   it('returns lowercase of a string', function(){
     var inputword='Welcome to the Graduate School Home Page';
     var outputword = homepg.landingPage(inputword);
     expect(outputword).to.equal('welcome to the graduate school home page');
   });
 });
