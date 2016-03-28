var express = require('express');
var router = express.Router();
var config = require('konphyg')(__dirname + '/../../config');
var logger = require('../../logger');
var async = require('async');
var common = require("../../helpers/common.js");
var courseAPI = require('../../API/course.js');
var contentfulAPI = require('../../API/contentful.js');
var marked = require('marked');

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
            var imageUrl = null;
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
            var section = null;
            if (body.items[0].fields.section) {
              section = body.items[0].fields.section;
            }
            var content = {
              title: body.items[0].fields.title,
              subtitle: body.items[0].fields.subtitle,
              imageUrl: imageUrl,
              relatedLinks: body.items[0].fields.relatedLinks,
              seoDescription: body.items[0].fields.seoDescription,
              seoKeywords: body.items[0].fields.seoKeywords,
              section: section
            }
            callback(null, content);
          });

        },
        getSessions : function (callback) {
          var sessionStatus = 'c';
          // var sessionDomain = 'CD';
          var sessionDomain = null;
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
                  session.startDate = formatDate(session.startDate);
                  session.endDate = formatDate(session.endDate);

                  orderedSessions[session.curricumTitle].push(session);
                }
              });
            }

            callback(error, orderedSessions);
          }, req.query["authToken"], sessionStatus, sessionDomain);
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
