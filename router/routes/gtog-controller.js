var express = require('express');
var router = express.Router();
var config = require('konphyg')(__dirname + '/../../config');
var logger = require('../../logger');
var async = require('async');
var common = require("../../helpers/common.js");
var courseAPI = require('../../API/course.js');
var session = require("../../API/manage/session-api.js");
var contentfulAPI = require('../../API/contentful.js');
var marked = require('marked');
var momentTz = require('moment-timezone');

// handlers for generic content papge
module.exports = {

    // Displays the Guaranteed to Go Page
    displayG2GPage : function(req, res, next) {
      async.parallel({
        getGtoGPage : function (callback) {
          contentfulAPI.getGtoGPage(function(body, error){
            if (error) {
              return callback(error);
            }
            var title = "";
            var subtitle = "";
            var imageUrl = null;
            var relatedLinks = null;
            var section = null;
            var seoDescription = "";
            var seoKeywords = "";
            if (body.items[0] && body.items[0].fields) {
              if (body.items[0].fields.featureImage) {
                if (body.includes && body.includes.Asset) {
                  for (var i = 0; i < body.includes.Asset.length; i++) {
                    if (body.items[0].fields.featureImage.sys.id === body.includes.Asset[i].sys.id) {
                      imageUrl = body.includes.Asset[i].fields.file.url;
                      break;
                    }
                  }
                }
              }
              title = body.items[0].fields.title;
              subtitle = body.items[0].fields.subtitle;
              seoDescription = body.items[0].fields.seoDescription;
              seoKeywords = body.items[0].fields.seoKeywords;
              relatedLinks = body.items[0].fields.relatedLinks;
              section = body.items[0].fields.section;
            }

            var content = {
              title: title,
              subtitle: subtitle,
              imageUrl: imageUrl,
              relatedLinks: relatedLinks,
              seoDescription: seoDescription,
              seoKeywords: seoKeywords,
              section: section
            }
            callback(null, content);
          });

        },
        getSessions : function (callback) {
          var sessionStatus = 'c';
          var sessionDomain = 'CD';
          courseAPI.getSessions(function (error, sessions){

            var formatDate = function (inFormat) {
              if (common.isEmpty(inFormat)) {
                return inFormat;
              }

              var arr = inFormat.split('-');

              var outFormat = "";
              if (arr.length == 3) {
                outFormat = outFormat + arr[1] + '/';
                outFormat = outFormat + arr[2] + '/';
                outFormat = outFormat + arr[0];
              } else {
                outFormat = inFormat;
              }
              return outFormat;
            }

            // Create a map. The curriculum title will be the key.
            var orderedSessions = {};
            if (common.isEmpty(error)) {
              // If key doesn't exit we add it
              // Once the key is there the value is an array and session is added to it.
              sessions.forEach (function(session, i) {
                if (session.curricumTitle) {
                  if (common.isEmpty(orderedSessions[session.curricumTitle])) {
                    orderedSessions[session.curricumTitle] = [];
                  }

                  var tmpRegistrationUrl = config("properties").registrationUrl;
                  tmpRegistrationUrl = tmpRegistrationUrl.replace("[courseId]", session.courseCode);
                  tmpRegistrationUrl = tmpRegistrationUrl.replace("[sessionId]", session.classNumber);
                  session.registrationUrl = tmpRegistrationUrl;

                  // use EST timezone to calculate the registration deadline before formatting the dates
                  var registrationDeadline = momentTz.tz(session.startDate.replace("-", " "), 'YYYY MM DD', "America/New_York");

                  session.startDate = formatDate(session.startDate);
                  session.endDate = formatDate(session.endDate);

                  //If the deadline to register has already passed for EST, do not show the session
                  if (registrationDeadline.isAfter(momentTz().tz("America/New_York"))) {
                    orderedSessions[session.curricumTitle].push(session);
                  }
                }
              });
            }

            callback(error, orderedSessions);
          }, session.getSessionData(req, "authToken"), sessionStatus, sessionDomain);
        }
      }, function (err, results) {

        if (err) {
            logger.error("Error rendering  G2G page", err);
            common.redirectToError(res);
            return;
        }

        res.render('gtog/gtog', { title: results.getGtoGPage.title,
          content: results.getGtoGPage,
          curriculumSessions: results.getSessions,
          markdown: marked
        });
      });
    }
} // end module.exports
