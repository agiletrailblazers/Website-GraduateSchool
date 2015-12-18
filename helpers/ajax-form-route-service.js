var express = require('express');
var contentfulForms = require('../API/contentful_forms.js');
var async = require('async');
var router = express.Router();
var bodyParser = require('body-parser');
var mailer = require('../API/nodemailer.js');
var google = require('../API/google.js');
var validator = require('validator');
var config = require('konphyg')("./config");
var logger = require('../logger');
var validations = require('../public/javascripts/forms/validations.js');

module.exports = {
  validateContactUsfields: function(callback, params) {
    response = {};
    response.errors = {};
    // Validate params.firstName
    switch (true) {
      case (params.firstName.length === 0):
        response.errors.firstName = "First name is empty.";
        break;
      case (!validator.isLength(params.firstName.trim(), 3)):
        response.errors.firstName = "First name must be at least 3 characters.";
        break;
    }
    // Validate params.lastName
    switch (true) {
      case (!params.lastName):
        response.errors.lastName = "Last name is empty.";
        break;
      case (!validator.isLength(params.lastName.trim(), 3)):
        response.errors.lastName = "Last name must be at least 3 characters.";
        break;
    }
    // Validate params.email
    if (params.communicationPref == 'Email') {
      switch (true) {
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
      switch (true) {
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
  validateOnsiteInquiryfields: function(callback, params) {
    response = {};
    response.errors = {};
    // Validate params.firstName
    switch (true) {
      case (params.address.firstName.length === 0):
        response.errors.firstName = "First name is empty.";
        break;
      case (!validator.isLength(params.address.firstName.trim(), 3)):
        response.errors.firstName = "First name must be at least 3 characters.";
        break;
    }
    // Validate params.lastName
    switch (true) {
      case (!params.address.lastName):
        response.errors.lastName = "Last name is empty.";
        break;
      case (!validator.isLength(params.address.lastName.trim(), 3)):
        response.errors.lastName = "Last name must be at lease 3 characters.";
        break;
    }
    // Validate organization
    switch (true) {
      case (!params.address.organization):
        response.errors.organization = "Organization is empty.";
        break;
      case (!validator.isLength(params.address.organization.trim(), 3)):
        response.errors.organization = "Organization must be atleast 3 characters.";
        break;
    }
    // Validate params.email
    switch (true) {
      case (!params.contact.email):
        response.errors.email = "Email is empty.";
        break;
      case (!validator.isEmail(params.contact.email)):
        response.errors.email = "Email is in the wrong format."
        break;
    }

    // Validate params.phone
    switch (true) {
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
    switch (true) {
      case (params.firstName.length === 0):
        response.errors.firstName = "First name is empty.";
        break;
      case (!validator.isLength(params.firstName.trim(), 3)):
        response.errors.firstName = "First name must be at least 3 characters.";
        break;
    }
    // Validate params.lastName
    switch (true) {
      case (!params.lastName):
        response.errors.lastName = "Last name is empty.";
        break;
      case (!validator.isLength(params.lastName.trim(), 3)):
        response.errors.lastName = "Last name must be at least 3 characters.";
        break;
    }
    // Validate params.email
    switch (true) {
      case (!params.email):
        response.errors.email = "Email is empty.";
        break;
      case (!validator.isEmail(params.email.trim())):
        response.errors.email = "Email is in the wrong format.";
        break;
    }
    // Validate params.phone
    switch (true) {
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
      case (!validator.isLength(params.instructor.trim(), 1)):
        response.errors.instructor = "Instructor field must be greater than 1 characters.";
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

    // Validate Course Start Date
    switch (true) {
      case (!params.startDate):
        response.errors.courseStartDate = "Please select course start date."
        break;
    }

    // Validate Course End Date
    switch (true) {
      case (!params.endDate):
        response.errors.courseEndDate = "Please select course end date."
        break;
    }

    // Validate Course Location
    switch (true) {
      case (!params.courseLocation):
        response.errors.courseLocation = "Course Location is empty."
        break;
      case (!validator.isLength(params.courseLocation.trim(), 3)):
        response.errors.courseTitle = "Course Location must be greater than 3 characters."
        break;
    }

    // Validate Captcha
    if (!params.captchaResponse) {
      response.errors.captchaResponse = "Please select recaptcha.";
    }
    callback(response);
  },
  validateRequestProctor: function(callback, params) {
    response = {};
    response.errors = {};
    // Validate params.firstName
    switch (true) {
      case (params.student.firstName.length === 0):
        response.errors.firstName = "First name is empty.";
        break;
      case (!validator.isLength(params.student.firstName.trim(), 3)):
        response.errors.firstName = "First name must be at least 3 characters.";
        break;
    }
    // Validate params.lastName
    switch (true) {
      case (!params.student.lastName):
        response.errors.lastName = "Last name is empty.";
        break;
      case (!validator.isLength(params.student.lastName.trim(), 3)):
        response.errors.lastName = "Last name must be at least 3 characters.";
        break;
    }
    // Validate params.email
    switch (true) {
      case (!params.student.email):
        response.errors.email = "Email is empty.";
        break;
      case (!validator.isEmail(params.student.email.trim())):
        response.errors.email = "Email is in the wrong format.";
        break;
    }
    // Validate params.phone
    switch (true) {
      case (!params.student.phone.day):
        response.errors.phone = "Phone number is empty.";
        break;
      case (!params.student.phone.day.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)):
        response.errors.phone = "Phone number is not in the correct format.";
        break;
    }
    // Validate Instructor
    switch (true) {
      case (!params.student.instructor):
        response.errors.instructor = "Instructor field is empty.";
        break;
      case (!validator.isLength(params.student.instructor.trim(), 1)):
        response.errors.instructor = "Instructor field must be 1 characters.";
        break;
    }
    // Validate Course Code
    switch (true) {
      case (!params.student.courseCode):
        response.errors.courseCode = "Course code field is empty.";
        break;
      case (!validator.isLength(params.student.courseCode.trim(), 3)):
        response.errors.courseCode = "Course code must be greater than 3 characters.";
        break;
    }
    // Validate Course Title
    switch (true) {
      case (!params.student.courseTitle):
        response.errors.courseTitle = "Course title is empty."
        break;
      case (!validator.isLength(params.student.courseTitle.trim(), 3)):
        response.errors.courseTitle = "Course title must be greater than 3 characters."
        break;
    }
    // Validate Proctors First Name
    switch (true) {
      case (!params.proctor.firstName):
        response.errors.proctorFirstName = "Proctor's first name is empty."
        break;
      case (!validator.isLength(params.proctor.firstName.trim(), 3)):
        response.errors.proctorFirstName = "Proctor's first name must be greater than 3 characters."
        break;
    }
    // Validate Proctors Last Name
    switch (true) {
      case (!params.proctor.lastName):
        response.errors.proctorLastName = "Proctor's first name is empty."
        break;
      case (!validator.isLength(params.proctor.lastName.trim(), 3)):
        response.errors.proctorLastName = "Proctor's first name must be greater than 3 characters."
        break;
    }
    // Validate Proctors Email
    switch (true) {
      case (!params.proctor.email):
        response.errors.proctorEmail = "Proctor's email is empty.";
        break;
      case (!validator.isEmail(params.proctor.email.trim())):
        response.errors.proctorEmail = "Proctor's email is in the wrong format.";
        break;
    }
    // Validate Captcha
    if (!params.captchaResponse) {
      response.errors.captchaResponse = "Please select recaptcha.";
    }
    callback(response);
  },
  validateCustomerFeedBack: function(callback, params) {
    response = {};
    response.errors = {};
    switch (true) {

      case (params.typePerson.length === 0):
        response.errors.typePerson = "First name is empty.";
        break;
      case (!validator.isLength(params.firstName.trim(), 3)):
        response.errors.firstName = "First name must be at least 3 characters.";
        break;
      case (validator.isLength(params.email.trim(), 1)):
        if (!validator.isEmail(params.email)) {
          response.errors.email = "Email is in the wrong format."
          break;
        }
    }
    if (!params.captchaResponse) {
      response.errors.captchaResponse = "Please select recaptcha.";
    }
    callback(response);
  },
  validateCertificateProgramForms: function(callback, params) {
    response = {};
    response.errors = {};
    // Validate params.firstName
    switch (true) {
      case (params.firstName.length === 0):
        response.errors.firstName = "First name is empty.";
        break;
      case (!validator.isLength(params.firstName.trim(), 3)):
        response.errors.firstName = "First name must be at least 3 characters.";
        break;
    }
    // Validate params.lastName
    switch (true) {
      case (!params.lastName):
        response.errors.lastName = "Last name is empty.";
        break;
      case (!validator.isLength(params.lastName.trim(), 3)):
        response.errors.lastName = "Last name must be at least 3 characters.";
        break;
    }
    // Validate params.email
    switch (true) {
      case (!params.email):
        response.errors.email = "Email is empty.";
        break;
      case (!validator.isEmail(params.email.trim())):
        response.errors.email = "Email is in the wrong format.";
        break;
    }
    // Validate params.phone
    switch (true) {
      case (!params.phone):
        response.errors.phone = "Phone number is empty.";
        break;
      case (!params.phone.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)):
        response.errors.phone = "Phone number is not in the correct format.";
        break;
    }
    // Validate City
    switch (true) {
      case (!params.city):
        response.errors.city = "City is empty."
        break;
      case (!validator.isLength(params.city.trim(), 3)):
        response.errors.city = "City must be greater than 3 characters."
        break;
    }
    // Validate Zip
    switch (true) {
      case (!params.zip):
        response.errors.zip = "Zip is empty."
        break;
      case (!validator.isLength(params.zip.trim(), 5)):
        response.errors.zip = "Zip must be greater than 5 characters."
        break;
    }
    // Validate Street Address
    switch (true) {
      case (!params.streetAddress):
        response.errors.streetAddress = "Street Address is empty."
        break;
      case (!validator.isLength(params.streetAddress.trim(), 3)):
        response.errors.streetAddress = "Street Address must be greater than 3 characters."
        break;
    }
    // Validate Certificate
    if (params.certificate && !validator.isLength(params.streetAddress.trim(), 1)) {
      response.errors.certificate = "Name on Certificate must be 1 or more characters."
    }
    // Validate State
    if (!params.state) {
      response.errors.state = "Please select a state."
    }
    callback(response);
  },
  validateRequestCatalog: function(callback, params) {
    response = {};
    response.errors = {};
    // Validate params.firstName
    switch (true) {
      case (params.address.firstName.length === 0):
        response.errors.firstName = "First name is empty.";
        break;
      case (!validator.isLength(params.address.firstName.trim(), 3)):
        response.errors.firstName = "First name must be at least 3 characters.";
        break;
    }
    // Validate params.lastName
    switch (true) {
      case (!params.address.lastName):
        response.errors.lastName = "Last name is empty.";
        break;
      case (!validator.isLength(params.address.lastName.trim(), 3)):
        response.errors.lastName = "Last name must be at least 3 characters.";
        break;
    }
// Validate City
    switch (true) {
      case (!params.address.city):
        response.errors.city = "City is empty."
        break;
      case (!validator.isLength(params.address.city.trim(), 3)):
        response.errors.city = "City must be greater than 3 characters."
        break;
    }

    // Validate Zip
    switch (true) {
      case (!params.address.zip):
        response.errors.zip = "Zip is empty."
        break;
      case (!validator.isLength(params.address.zip.trim(), 5)):
        response.errors.zip = "Zip must be greater than 5 characters."
        break;
    }
    // Validate Street Address
    switch (true) {
      case (!params.address.street):
        response.errors.streetAddress = "Street Address is empty."
        break;
      case (!validator.isLength(params.address.street.trim(), 3)):
        response.errors.streetAddress = "Street Address must be greater than 3 characters."
        break;
    }

    // Validate params.email
    switch (true) {
      case (!params.contact.email):
        response.errors.email = "Email is empty.";
        break;
      case (!validator.isEmail(params.contact.email)):
        response.errors.email = "Email is in the wrong format."
        break;
    }

    // Validate params.phone
    switch (true) {
      case (!params.contact.phone):
        response.errors.phone = "Phone number is empty.";
        break;
      case (!params.contact.phone.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)):
        response.errors.phone = "Phone number is not in the correct format.";
        break;
    }

    // Validate State
    if (!params.address.state) {
      response.errors.state = "Please select a state."
    }

    if (!params.captchaResponse) {
      response.errors.captchaResponse = "Please select recaptcha.";
    }

    callback(response);
  },

  validateSubscriptionfields: function(callback, params) {
    response = {};
    response.errors = {};
    // Validate params.firstName
    switch (true) {
      case (!validator.isLength(params.firstName.trim(), 2)):
        response.errors.firstName = "First name is required and must be at least 2 characters.";
        break;
    }
    // Validate params.lastName
    switch (true) {
      case (!validator.isLength(params.lastName.trim(), 2)):
        response.errors.lastName = "Last name is required and must be at least 2 characters.";
        break;
    }
    // Validate email if needed
    if (params.emailSubscription == "true") {
      switch (true) {
        case (!validator.isEmail(params.email)):
          response.errors.email = "Email is required and must be a properly formatted email address."
          break;
      }
    }
    // Validate postal address if needed
    if (params.mailSubscription == "true") {
      // Validate Street Address
      switch (true) {
        case (!validator.isLength(params.street.trim(), 5)):
          response.errors.streetAddress = "Street Address is required and must be at least 5 characters."
          break;
      }

      // Validate City
      switch (true) {
        case (!validator.isLength(params.city.trim(), 3)):
          response.errors.city = "City is required and must be at least 3 characters."
          break;
      }

      // Validate Zip
      switch (true) {
        case (!validator.isLength(params.zip.trim(), 5)):
          response.errors.zip = "Zip is required and must be at least 5 characters."
          break;
      }

      // Validate State
      switch (true) {
        case (!validator.isLength(params.state.trim(), 1)):
          response.errors.state = "Please select a state."
          break;
      }

      // Validate phone
      switch (true) {
        case (!validator.isLength(params.phone.trim(), 1)):
          response.errors.phone = "Phone number is required."
          break;
      }
    }
    if (!config("properties").skipReCaptchaVerification) {
      if (!params.captchaResponse) {
        response.errors.captchaResponse = "Please select recaptcha.";
      }
    }
    else {
      logger.debug("validateSubscriptionfields - reCaptcha verification is turned off")
    }
    callback(response);
  },
};
