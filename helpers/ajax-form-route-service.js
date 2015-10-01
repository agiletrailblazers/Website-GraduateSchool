
var express = require('express');
var contentfulForms= require('../API/contentful_forms.js');
var async = require('async');
var router = express.Router();
var bodyParser = require('body-parser');
var mailer = require('../API/nodemailer.js');
var google = require('../API/google.js');
var validator = require('validator');


module.exports = {
  validateContactUsfields: function(callback,params) {
    response = {};
    response.errors = {};
    // Validate params.firstName
    switch(true) {
      case (params.firstName.length === 0):
      response.errors.firstName = "First name is empty.";
      break;
      case (!validator.isLength(params.firstName.trim(), 3)):
      response.errors.firstName = "First name must be at least 3 characters.";
      break;
    }
    // Validate params.lastName
    switch(true) {
      case (!params.lastName):
      response.errors.lastName = "Last name is empty.";
      break;
      case (!validator.isLength(params.lastName.trim(), 3)):
      response.errors.lastName = "Last name must be at least 3 characters.";
      break;
    }
    // Validate params.email
    if (params.communicationPref == 'Email') {
      switch(true) {
        case (!params.email):
        response.errors.email = "Email is empty.";
        break;
        case (!validator.isEmail(params.email.trim())):
        response.errors.email = "Email is in the wrong format."
        break;
      }
    }
    // Validate params.phone
    if (params.communicationPref == 'Phone') {
      switch(true) {
        case (!params.phone):
        response.errors.phone = "Phone number is empty.";
        break;
        case (!params.phone.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)):
        response.errors.phone = "Phone number is not in the correct format.";
        break;
      }
    }
    if (!params.captchaResponse) {
      response.errors.captchaResponse = "Please select recaptcha.";
    }
    callback(response);
  },
  validateOnsiteInquiryfields: function(callback,params) {
    response = {};
    response.errors = {};
    // Validate params.firstName
    switch(true) {
      case (params.address.firstName.length === 0):
      response.errors.firstName = "First name is empty.";
      break;
      case (!validator.isLength(params.address.firstName.trim(), 3)):
      response.errors.firstName = "First name must be at least 3 characters.";
      break;
    }
    // Validate params.lastName
    switch(true) {
      case (!params.address.lastName):
      response.errors.lastName = "Last name is empty.";
      break;
      case (!validator.isLength(params.address.lastName.trim(), 3)):
      response.errors.lastName = "Last name must be at lease 3 characters.";
      break;
    }
    // Validate organization
    switch(true) {
      case (!params.address.organization):
      response.errors.organization = "Organization is empty.";
      break;
      case (!validator.isLength(params.address.organization.trim(), 3)):
      response.errors.organization = "Organization must be atleast 3 characters.";
      break;
    }
    // Validate params.email
    switch(true) {
      case (!params.contact.email):
      response.errors.email = "Email is empty.";
      break;
      case (!validator.isEmail(params.contact.email)):
      response.errors.email = "Email is in the wrong format."
      break;
    }

    // Validate params.phone
    switch(true) {
      case (!params.contact.phone):
      response.errors.phone = "Phone number is empty.";
      break;
      case (!params.contact.phone.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)):
      response.errors.phone = "Phone number is not in the correct format.";
      break;
    }

    // Validate student count.
    if (parseInt(params.course.studentCount) !== undefined) {
      switch (true) {
        case (!validator.isLength(params.course.studentCount.trim(), 1)):
        response.errors.studentCount = "Please provide a number of students.";
        break;

        case (parseInt(params.course.studentCount) < 1):
        response.errors.studentCount = "Please provide a number of students."
        break;
      }
    } else {
      response.errors.studentCount = "Please provide a number of students."
    }
    // Validate hear about.
    if (!params.hearAbout) {
      response.errors.hearAbout = "Please tell us where you heard about Graduate School USA.";
    }

    if (!params.captchaResponse) {
      response.errors.captchaResponse = "Please select recaptcha.";
    }

    callback(response);
  },
  validateRequestDuplicate: function(callback, params) {
    response = {};
    response.errors = {};
    // Validate params.firstName
    switch(true) {
      case (params.firstName.length === 0):
      response.errors.firstName = "First name is empty.";
      break;
      case (!validator.isLength(params.firstName.trim(), 3)):
      response.errors.firstName = "First name must be at least 3 characters.";
      break;
    }
    // Validate params.lastName
    switch(true) {
      case (!params.lastName):
      response.errors.lastName = "Last name is empty.";
      break;
      case (!validator.isLength(params.lastName.trim(), 3)):
      response.errors.lastName = "Last name must be at least 3 characters.";
      break;
    }
    // Validate params.email
      switch(true) {
        case (!params.email):
        response.errors.email = "Email is empty.";
        break;
        case (!validator.isEmail(params.email.trim())):
        response.errors.email = "Email is in the wrong format.";
        break;
      }
    // Validate params.phone
      switch(true) {
        case (!params.phone):
        response.errors.phone = "Phone number is empty.";
        break;
        case (!params.phone.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)):
        response.errors.phone = "Phone number is not in the correct format.";
        break;
      }
    // Validate Instructor
    switch (true) {
      case (!params.instructor):
        response.errors.instructor = "Instructor field is empty.";
        break;
      case (!validator.isLength(params.instructor.trim(), 3)):
        response.errors.instructor = "Instructor field must be greater than 3 characters.";
        break;
    }
    // Validate Course Code
    switch (true) {
      case (!params.courseCode):
        response.errors.courseCode = "Course code field is empty.";
        break;
      case (!validator.isLength(params.courseCode.trim(), 3)):
        response.errors.courseCode = "Course code must be greater than 3 characters.";
        break;
    }
    // Validate Course Title
    switch (true) {
      case (!params.courseTitle):
        response.errors.courseTitle = "Course title is empty."
        break;
      case (!validator.isLength(params.courseTitle.trim(), 3)):
        response.errors.courseTitle = "Course title must be greater than 3 characters."
        break;
    }
    // Validate Captcha
    if (!params.captchaResponse) {
      response.errors.captchaResponse = "Please select recaptcha.";
    }
    callback(response);
  }

};
