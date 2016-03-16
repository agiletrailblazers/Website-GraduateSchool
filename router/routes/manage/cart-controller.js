var express = require('express');
var router = express.Router();
var config = require('konphyg')(__dirname + '/../../../config');
var logger = require('../../../logger');
var async = require('async');
var crypto = require("crypto-js");
var truncator = require("underscore.string/truncate");
var uuid = require('uuid');
var common = require("../../../helpers/common.js");
var courseAPI = require('../../../API/course.js');
var contentfulAPI = require('../../../API/contentful.js');
var session = require('../../../API/manage/session-api.js');
var user = require("../../../API/manage/user-api.js");
var payment = require("../../../API/manage/payment-api.js");

// handlers for cart related routes

module.exports = {

    // Display the shopping cart. This is entry point into cart from course search, in which case the
    // session id and course id will be passed in as query parameters.  It is also the landing page
    // for a user if they cancel out of the payment flow, in which case the course id and session id will
    // already be contained in the session data
    displayCart : function(req, res, next) {

        var sessionData = session.getSessionData(req);
        if (!sessionData.cart) {
            // no cart in session, initialize it
            sessionData.cart = {};
        }

        // update the course and session ids in the cart if they were passed in as query parameters,
        // this is how they will be initially passed in from the course details page. They may also already
        // be in the session data if we are getting back to the cart by some other means
        if (req.query.courseId) {
            sessionData.cart.courseId = req.query.courseId;
        }
        if (req.query.sessionId) {
            sessionData.cart.sessionId = req.query.sessionId;
        }

        async.parallel({
            course: function(callback) {
                var courseId = sessionData.cart.courseId;
                if (!courseId) {
                    return callback(new Error("Missing courseId parameter"));
                }

                logger.debug("Looking up course " + courseId + " for shopping cart");
                courseAPI.performExactCourseSearch(function(response, error, course) {
                    // callback with the error, this will cause async module to stop executing remaining
                    // functions and jump immediately to the final function, it is important to return
                    // so that the task callback isn't called twice
                    if (error) return callback(error);

                    return callback(null, course);
                }, courseId, req.query["authToken"]);
            },
            session: function(callback) {
                var sessionId = sessionData.cart.sessionId;
                if (!sessionId) {
                    return callback(new Error("Missing sessionId parameter"));
                }

                logger.debug("Looking up course session " + sessionId + " for shopping cart");
                courseAPI.getSession(sessionId, function (error, session) {
                    // callback with the error, this will cause async module to stop executing remaining
                    // functions and jump immediately to the final function, it is important to return
                    // so that the task callback isn't called twice
                    if (error) return callback(error);

                    // Change date format in the session.
                    session["startDate"] = session["startDate"].date('MMM DD, YYYY');
                    if (common.isNotEmpty(session["endDate"])) {
                        session["endDate"] = session["endDate"].date('MMM DD, YYYY');
                    }
                    return callback(null, session);
                }, req.query["authToken"]);
            },
            contentfulCourseInfo: function(callback) {
                contentfulAPI.getCourseDetails(function(contentfulCourseInfo, error) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, contentfulCourseInfo);
                    }
                });
            },
            nextpage: function(callback) {
                // if the user is already logged in then they should go from the cart directly into payment,
                // if they are not logged in then they should go from the cart to login/create user
                if (sessionData.userId) {
                    callback(null, "/manage/cart/payment");
                }
                else {
                    callback(null, "/manage/user/loginCreate");
                }
                return;
            }
        }, function(err, content) {
            if (err) {
                logger.error("Error rendering shopping cart", err);
                common.redirectToError(res);
                return;
            }

            // grab any possible error message from the session data for display
            // this error message would have been set in session by another route
            // before redirecting back to this route
            var tmpError = common.isNotEmpty(sessionData.cart.error) ? sessionData.cart.error: null;

            // now clear out the error so that it isn't re-displayed
            sessionData.cart.error = null;

            // update the session data
            session.setSessionData(res, sessionData);
            res.render('manage/cart/cart', {
                title: "Course Registration",
                course: content.course,
                session: content.session,
                nextpage: content.nextpage,
                contentfulCourseInfo: content.contentfulCourseInfo,
                error: tmpError
            });
        });
    },

    // Display the payment page.  All necessary information about the cart must be in the session data.
    displayPayment: function(req, res, next) {

        // get the session data, it contains the cart data
        var sessionData = session.getSessionData(req);

        // payment related configuration properties
        var paymentConfig = config("properties").manage.payment;

        async.waterfall([
            function(callback) {
                // while we don't use the user id in the payment page, we don't want to send someone into
                // payment if we don't know who they are, so this is more of sanity check / safety precaution
                if (!sessionData.userId) {
                    return callback(new Error("No user id in session"));
                }

                var sessionId = sessionData.cart.sessionId;
                if (!sessionId) {
                    return callback(new Error("Missing sessionId parameter"));
                }

                logger.debug("Looking up course session " + sessionId + " for payment");
                courseAPI.getSession(sessionId, function(error, courseSession) {
                    // callback with the error, this will cause async module to stop executing remaining
                    // functions and jump immediately to the final function, it is important to return
                    // so that the task callback isn't called twice
                    if (error) return callback(error);

                    // Change date format in the session.
                    courseSession["startDate"] = courseSession["startDate"].date('MMM DD, YYYY');
                    if (common.isNotEmpty(session["endDate"])) {
                        courseSession["endDate"] = courseSession["endDate"].date('MMM DD, YYYY');
                    }

                    return callback(null, courseSession);
                }, req.query["authToken"]);
            },
            function(courseSession, callback) {

                logger.debug("Initiating payment processing for user " + sessionData.userId);

                if (!sessionData.cart || !sessionData.cart.sessionId) {
                    return callback(new Error("No session id in the cart"));
                }

                logger.debug("Looking up user details for user " + sessionData.userId)

                user.getUser(sessionData.userId , function(error, retrievedUser) {
                    // callback with the error, this will cause async module to stop executing remaining
                    // functions and jump immediately to the final function, it is important to return
                    // so that the task callback isn't called twice
                    if (error) return callback(error);

                    //User info manually input may be too long, so ensure strings are no longer than maximum before sending to Cybersource
                    retrievedUser.person.firstName = truncator(retrievedUser.person.firstName, 60, [truncateString = ""]);
                    retrievedUser.person.lastName = truncator(retrievedUser.person.lastName, 60, [truncateString = ""]);
                    retrievedUser.person.primaryAddress.address1 = truncator(retrievedUser.person.primaryAddress.address1,60, [truncateString = ""]);
                    retrievedUser.person.primaryAddress.address2 = truncator(retrievedUser.person.primaryAddress.address2, 60, [truncateString = ""]);
                    retrievedUser.person.primaryAddress.city = truncator(retrievedUser.person.primaryAddress.city, 50, [truncateString = ""]);
                    retrievedUser.person.primaryAddress.state =  truncator(retrievedUser.person.primaryAddress.state, 2, [truncateString = ""]);
                    retrievedUser.person.primaryAddress.postalCode = truncator(retrievedUser.person.primaryAddress.postalCode, 10, [truncateString = ""]);
                    retrievedUser.person.emailAddress = truncator(retrievedUser.person.emailAddress, 255, [truncateString = ""]);

                    return callback(null, retrievedUser, courseSession);
                }, req.query["authToken"])
            },
            function(retrievedUser, courseSession, callback) {
                var sessionId = sessionData.cart.sessionId;

                logger.debug("Checking if the user " + retrievedUser.id + " has already registered for session " + sessionId);

                user.getRegistration(retrievedUser.id, sessionId, function(error, retrievedRegistrations) {
                    // callback with the error, this will cause async module to stop executing remaining
                    // functions and jump immediately to the final function, it is important to return
                    // so that the task callback isn't called twice
                    if (error) return callback(error);

                    if (retrievedRegistrations) {
                        logger.debug(sessionData.userId + " is already registered for session " + sessionId);
                        // callback with error will force asynce module to stop execution
                        return callback(new Error("User is already registered"), true, retrievedUser);
                    }
                    return callback(null, retrievedUser, courseSession);
                }, req.query["authToken"]);
            },
            function(retrievedUser, courseSession, callback) {
                logger.debug("Building and signing payment request data");

                var transaction_uuid = uuid.v4();
                var reference_number = uuid.v4();
                var now = new Date();
                var signed_date_time = now.toISOString().slice(0, 19) + 'Z'; // must remove millis

                // initialize payment data in cart
                if (!sessionData.cart.payment) {
                    sessionData.cart.payment = {};
                }
                sessionData.cart.payment.transaction_uuid = transaction_uuid;
                sessionData.cart.payment.reference_number = reference_number;

                var parameters = new Map();
                parameters.set("access_key", paymentConfig.accessKey);
                parameters.set("profile_id", paymentConfig.profileId);
                parameters.set("transaction_uuid", transaction_uuid);
                parameters.set("signed_field_names", "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,line_item_count,item_0_name,item_0_unit_price,item_0_quantity,bill_to_forename,bill_to_surname,bill_to_address_line1,bill_to_address_line2,bill_to_address_city,bill_to_address_state,bill_to_address_country,bill_to_address_postal_code,bill_to_email");
                parameters.set("unsigned_field_names", "");
                parameters.set("signed_date_time", signed_date_time);
                parameters.set("locale", "en");
                parameters.set("transaction_type", "authorization");
                parameters.set("reference_number", reference_number);
                parameters.set("amount", courseSession["tuition"]);
                parameters.set("currency", "USD");
                // add line item info
                parameters.set("line_item_count", 1);
                parameters.set("item_0_name", courseSession["classNumber"]);
                parameters.set("item_0_unit_price", courseSession["tuition"]);
                parameters.set("item_0_quantity", 1);
                // add user and address info
                parameters.set("bill_to_forename", retrievedUser.person.firstName);
                parameters.set("bill_to_surname", retrievedUser.person.lastName);
                parameters.set("bill_to_address_line1", retrievedUser.person.primaryAddress.address1);
                parameters.set("bill_to_address_line2", retrievedUser.person.primaryAddress.address2);
                parameters.set("bill_to_address_city", retrievedUser.person.primaryAddress.city);
                parameters.set("bill_to_address_state", retrievedUser.person.primaryAddress.state);
                parameters.set("bill_to_address_country", "US");
                parameters.set("bill_to_address_postal_code", retrievedUser.person.primaryAddress.postalCode);
                parameters.set("bill_to_email", retrievedUser.person.emailAddress);
                var signatureStr = "";
                var i = 0;
                parameters.forEach(function(value, key) {
                    if (i != 0) {
                        signatureStr = signatureStr + ",";
                    }
                    signatureStr = signatureStr + key + "=" + value;
                    i++;
                });

                // encode the signature string
                var hash = crypto.HmacSHA256(signatureStr, paymentConfig.secretKey);
                var signature = crypto.enc.Base64.stringify(hash);

                return callback(null, false, retrievedUser, parameters, signature);
            }
        ], function(err, alreadyRegistered, retrievedUser, parameters, signature) {

            if (err) {

                if (alreadyRegistered) {

                    // user is already registered, set appropriate error message and send back to cart
                    sessionData.cart.error = retrievedUser.person.emailAddress   + " is already registered for this session. If you have any questions, please contact our please contact our Customer Service Center at (888) 744-4723.";
                    sessionData.cart.payment = {}; // Ensure there is no payment information in the cart
                    session.setSessionData(res, sessionData);

                    res.redirect('/manage/cart');
                    return;
                }
                else {
                    logger.error("Error rendering payment page", err);
                    common.redirectToError(res);
                    return;
                }
            }

            // update the session data
            session.setSessionData(res, sessionData);
            res.render('manage/cart/payment', {
                parameters: parameters,
                signature: signature,
                paymentUrl: paymentConfig.url
            });
        });
    },

    // handle the payment canceled post from Cybersource payment
    cancelPayment: function(req, res, next) {

        logger.debug("Processing payment canceled");

        var sessionData = session.getSessionData(req);

        async.series({
            authReversal: function(callback) {

                // can arrive here in one of two ways, having canceled from the CyberSource page
                // or having canceled from the confirmation page
                // only have to reverse authorization if cancel from confirmation page
                if (sessionData.cart && sessionData.cart.payment && sessionData.cart.payment.authorization) {

                    logger.debug("Sending payment authorization reversal for user " + sessionData.userId);

                    var payments = [
                        {
                            amount: sessionData.cart.payment.authorization.amount,
                            authorizationId: sessionData.cart.payment.authorization.authId,
                            merchantReferenceId: sessionData.cart.payment.authorization.referenceNumber
                        }
                    ];

                    payment.sendAuthReversal(payments, function(error) {
                        // auth reversal failures should not render an error, simply log the warning and move on
                        if (error) {
                            logger.warn("Failure processing payment authorization reversal" + error.message);
                        }

                        // there is nothing to return for a payment authorization reversal
                        return callback(null, "");

                    }, req.query["authToken"]);
                }
                else {
                    return callback(null, "");
                }
            }
        }, function(err, content) {

            if (err) {
                logger.error("Error processing cancel from registration", err);
                common.redirectToError(res);
                return;
            }

            // remove all payment data from the cart, but leave all other contents
            sessionData.cart.payment = {};
            session.setSessionData(res, sessionData);

            // redirect back to the cart
            res.redirect('/manage/cart');
        });
    },

    // handle the payment confirm post from Cybersource payment
    confirmPayment: function(req, res, next) {

        logger.debug("Processing payment confirm");

        var sessionData = session.getSessionData(req);
        var props = config("properties");

        async.parallel({
            course: function(callback) {
                var courseId = sessionData.cart.courseId;
                if (!courseId) {
                    return callback(new Error("Missing courseId parameter"));
                }

                logger.debug("Looking up course " + courseId + " for shopping cart");
                courseAPI.performExactCourseSearch(function(response, error, course) {
                    // callback with the error, this will cause async module to stop executing remaining
                    // functions and jump immediately to the final function, it is important to return
                    // so that the task callback isn't called twice
                    if (error) return callback(error);

                    return callback(null, course);
                }, courseId, req.query["authToken"]);
            },
            session: function(callback) {
                var sessionId = sessionData.cart.sessionId;
                if (!sessionId) {
                    return callback(new Error("Missing sessionId parameter"));
                }

                logger.debug("Looking up course session " + sessionId + " for shopping cart");
                courseAPI.getSession(sessionId, function(error, session) {
                    // callback with the error, this will cause async module to stop executing remaining
                    // functions and jump immediately to the final function, it is important to return
                    // so that the task callback isn't called twice
                    if (error) return callback(error);

                    // Change date format in the session.
                    session["startDate"] = session["startDate"].date('MMM DD, YYYY');
                    if (common.isNotEmpty(session["endDate"])) {
                        session["endDate"] = session["endDate"].date('MMM DD, YYYY');
                    }

                    return callback(null, session);
                }, req.query["authToken"]);
            },
            authorization: function(callback) {

                // this is more of sanity check / safety precaution
                if (!sessionData.userId) {
                    return callback(new Error("No user id in session"));
                }

                // get the cybersource response
                var cybersourceResponse = req.body;

                // ensure that request was not tampered with by re-building the signature and comparing to the one set by cybersource
                var cybersourceSignedFields = (cybersourceResponse.signed_field_names).split(',');
                var parameters = new Map();
                cybersourceSignedFields.forEach(function(field) {
                    parameters.set(field, cybersourceResponse[field]);
                });

                // generate the signature string
                var signatureStr = "";
                var i = 0;
                parameters.forEach(function(value, key) {
                    if (i != 0) {
                        signatureStr = signatureStr + ",";
                    }
                    signatureStr = signatureStr + key + "=" + value;
                    i++;
                });

                // encode the signature string
                var hash = crypto.HmacSHA256(signatureStr, props.manage.payment.secretKey);
                var signature = crypto.enc.Base64.stringify(hash);

                logger.debug("Generated signed signature string: " + signature);
                logger.debug("Cybersource signed signature string: " + cybersourceResponse.signature);
                // compare the generated signature string with the one provided by cybersource
                if (signature !== cybersourceResponse.signature) {
                    // signature strings don't match, data may have been altered
                    return callback(new Error("Generated signature string does not match cybersource signature"));
                }

                logger.debug("Authorization response, decision: " + cybersourceResponse.decision + ", reason code: " + cybersourceResponse.reason_code);

                // populate the payment authorization data from the cybersource response
                var authorization = {
                    approved: (cybersourceResponse.decision === "ACCEPT") ? true : false,
                    reasonCode: cybersourceResponse.reason_code,
                    cardNumber: cybersourceResponse.req_card_number,
                    cardExpiry: cybersourceResponse.req_card_expiry_date,
                    authId: cybersourceResponse.transaction_id,
                    amount: cybersourceResponse.auth_amount,
                    referenceNumber: cybersourceResponse.req_reference_number
                };

                if (authorization.approved) {
                    // add required fields to session for completing the sale after confirmation
                    sessionData.cart.payment.authorization = authorization;
                }

                return callback(null, authorization);
            }
        }, function(err, content) {
            if (err) {
                logger.error("Error rendering payment confirmation", err);
                common.redirectToError(res);
                return;
            }

            // update the session data
            session.setSessionData(res, sessionData);

            if (content.authorization.approved) {
                // authorization approved, display confirmation page
                logger.debug("Payment was authorized");
                res.render('manage/cart/confirmation', {
                    title: "Course Registration - Confirmation",
                    course: content.course,
                    session: content.session,
                    authorization: content.authorization,
                    error: null
                });
            }
            else {
                // display cart with error message

                // get the list of declined reason codes and error reason codes
                // that need special handling
                var declinedReasonCodes = props.manage.payment.declinedReasonCodes;
                var errorReasonCodes = props.manage.payment.errorReasonCodes;

                if (declinedReasonCodes.indexOf(content.authorization.reasonCode) > -1) {
                    // this is a declined reason code, set error message and send to cart page
                    logger.debug("Payment was not authorized with decline code, redirect to the cart with error message");

                    // set appropriate error message and send back to cart
                    sessionData.cart.error = "We're sorry, but your payment could not be processed. Please try another payment method or contact your financial institution if you feel this was in error.";
                    sessionData.cart.payment = {}; // Ensure there is no payment information in the cart
                    session.setSessionData(res, sessionData);

                    res.redirect('/manage/cart');
                }
                else if (errorReasonCodes.indexOf(content.authorization.reasonCode) > -1) {
                    // this is an error reason code, set error message and send to cart page
                    logger.debug("Payment was not authorized with error code, redirect to the cart with error message");

                    // set appropriate error message and send back to cart
                    sessionData.cart.error = "We're sorry, but we've encountered an issue while processing your registration request. To finalize your registration, please contact our Customer Service Center at (888) 744-4723.";
                    sessionData.cart.payment = {}; // Ensure there is no payment information in the cart
                    session.setSessionData(res, sessionData);

                    res.redirect('/manage/cart');
                }
                else {
                    // not a reason code with specific handling, send to general error page
                    logger.debug("Payment was not authorized, redirect to the general error page");
                    common.redirectToError(res);
                }
            }
        });
    },

    // handle the payment receipt
    completePayment: function(req, res, next) {

        logger.debug("Processing payment complete");

        var sessionData = session.getSessionData(req);

        async.series({
            course: function(callback) {
                var courseId = sessionData.cart.courseId;
                if (!courseId) {
                    return callback(new Error("Missing courseId parameter"));
                }

                logger.debug("Looking up course " + courseId + " for shopping cart");
                courseAPI.performExactCourseSearch(function(response, error, course) {
                    // callback with the error, this will cause async module to stop executing remaining
                    // functions and jump immediately to the final function, it is important to return
                    // so that the task callback isn't called twice
                    if (error) return callback(error);

                    return callback(null, course);
                }, courseId, req.query["authToken"]);
            },
            session: function(callback) {
                var sessionId = sessionData.cart.sessionId;
                if (!sessionId) {
                    return callback(new Error("Missing sessionId parameter"));
                }

                logger.debug("Looking up course session " + sessionId + " for shopping cart");
                courseAPI.getSession(sessionId, function(error, session) {
                    // callback with the error, this will cause async module to stop executing remaining
                    // functions and jump immediately to the final function, it is important to return
                    // so that the task callback isn't called twice
                    if (error) return callback(error);

                    // Change date format in the session.
                    session["startDate"] = session["startDate"].date('MMM DD, YYYY');
                    if (common.isNotEmpty(session["endDate"])) {
                        session["endDate"] = session["endDate"].date('MMM DD, YYYY');
                    }

                    return callback(null, session);
                }, req.query["authToken"]);
            },
            registrationResult: function(callback) {

                var registrationRequest = {
                    registrations:[
                        {
                            orderNumber: null,
                            studentId: sessionData.userId,
                            sessionId: sessionData.cart.sessionId
                        }
                    ],
                    payments:[
                        {
                            amount: sessionData.cart.payment.authorization.amount,
                            authorizationId: sessionData.cart.payment.authorization.authId,
                            merchantReferenceId: sessionData.cart.payment.authorization.referenceNumber
                        }
                    ]
                };

                // register the user
                user.registerUser(sessionData.userId, registrationRequest, function(error, registrationResult) {
                    // the success or failure of registration is contained in the result, so ignore the error parameter
                    return callback(null, registrationResult);
                }, req.query["authToken"]);
            },
            payment: function(callback) {
                var payment = sessionData.cart.payment.authorization;
                return callback(null, payment);
            }
        }, function(err, content) {

            if (err) {

                logger.error("Error processing registration and payment", err);
                common.redirectToError(res);
                return;
            }

            // hold onto authorization for last display of page
            var tmpAuthorization = sessionData.cart.payment.authorization;

            // in every case, we want to clear the payment information out of the session data at this point
            sessionData.cart.payment = {};
            session.setSessionData(res, sessionData);

            // inspect the registration result to determine appropriate action
            if (content.registrationResult.generalError) {
                logger.error("General error during registration and payment");

                common.redirectToError(res);
            }
            else if (content.registrationResult.paymentDeclinedError) {
                logger.debug("Registration failure due to declined payment for user " + sessionData.userId);

                res.render('manage/cart/confirmation', {
                    title: "Course Registration - Confirmation",
                    course: content.course,
                    session: content.session,
                    authorization: tmpAuthorization,
                    error: "We're sorry, but your payment could not be processed. Please contact your financial institution if you feel this was in error."
                });
            }
            else if (content.registrationResult.paymentAcceptedError) {
                logger.warn("Payment was accepted but registration not guaranteed for user " + sessionData.userId);

                res.render('manage/cart/confirmation', {
                    title: "Course Registration - Confirmation",
                    course: content.course,
                    session: content.session,
                    authorization: tmpAuthorization,
                    error: "We're sorry, but we've encountered an issue while processing your registration request. To finalize your registration, please contact our Customer Service Center at (888) 744-4723 ."
                });
            }
            else {

                // registration and payment were successful, clear out the cart and render the receipt
                sessionData.cart = {};

                // update the session data
                session.setSessionData(res, sessionData);

                res.render('manage/cart/receipt', {
                    title: "Course Registration - Receipt",
                    course: content.course,
                    session: content.session,
                    registrations: content.registrationResult.registrationResponse.registrations,
                    payment: content.payment
                });
            }
        });
    }
} // end module.exports
