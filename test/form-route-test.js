var chai = require('chai');
var expect = require('chai').expect;
var nock = require('nock');
var should = require("should");
var test = require('tap').test;
var config = require('konphyg')(__dirname + "/../config");
var temp = require('temp').track();
var request = require('request');
var proxyquire = require('proxyquire');
var contentful_forms = proxyquire('../API/contentful_forms.js',
  {
    "../helpers/common.js": {
      cachedRequest: function (reqParams, callback) {
        request(reqParams, function (error, response, body) {
          return callback(error, response, body);
        });
      }
    }
  });


test('form route test for inquiry form', function (t) {
  var contentfulformServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/80IOLAFnVuYGk6U4ocooC')
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
  contentful_forms.getInquiryForm(function (response, error) {
    hearAboutTrainingString = 'From a GS training officer.';
    expect(response.fields.howDidYouHearAboutTraining[0].name).to.equal(hearAboutTrainingString);
    expect(response).to.be.a('object');
  });
  t.end();
});

test('form route test for Contact us', function (t) {
  var contentfulformServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/6Av0MIjzZC2qIsGKUGyKS0')
    .reply(200, {
      'accept': 'application/json',
      "fields": {
        "title": "Contact Us",
      }
    });
  contentfulformServer;
  contentful_forms.getContactUs(function (response, error) {
    fieldsTitle = "Contact Us";
    expect(response.fields.title).to.equal(fieldsTitle);
    expect(response).to.be.a('object');
  });
  t.end();
});

test('form route test for Request Duplicate Form', function (t) {
  var contentfulformServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/mlBs5OCiQgW84oiMm4k2s')
    .reply(200, {
      'accept': 'application/json',
          "fields": {
            "sectionTitle": "Duplicate Request Forms",
            "sectionFooterDescription": "To receive a duplicate certificate of completion for a specific course, please complete the student information below and submit the form.",
            "sectionHeaderDescription": "A duplicate course completion certificate will be e-mailed to you by the Office of the Registrar. Please allow 3-5 business days for processing.\n\nIf you have questions regarding the status of this request, please contact the Office of the Registrar at registrar@graduateschool.edu or (202) 314-3368.\n\n* = Required"
          }
    });
  contentfulformServer;

  contentful_forms.getFormWithHeaderAndFooter('mlBs5OCiQgW84oiMm4k2s', function(response, error) {
    expect(response.fields.sectionTitle).to.equal("Duplicate Request Forms");
  });
  t.end();
});

test('form route test for Request Duplicate Form Internal Error', function (t) {
  var contentfulformServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/mlBs5OCiQgW84oiMm4k2s')
    .reply(500, {
      'accept': 'application/json'
    });
  contentfulformServer;

  contentful_forms.getFormWithHeaderAndFooter('mlBs5OCiQgW84oiMm4k2s', function(response, error) {
    should.exist(error);
    should.not.exist(response);
  });
  t.end();
});

test('Form route test for Proctor Request Form', function (t) {
  var contentfulformServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/JgpDPSNoe4kQGWIkImKAM')
    .reply(200, {
      'accept': 'application/json',
          "fields": {
            "sectionTitle": "Proctor Request Form",
            "sectionHeaderDescription": "<p style=\"text-align:left\">Submission of this form signifies that the student has read, understands, and agrees to comply with Graduate School USA's <a href=\"http://graduateschool.edu/index.php?option=com_content&amp;task=view&amp;id=637\">proctored exam requirements</a>. The person acting as the proctor is in a position of trust, thus the proctor application will be reviewed and approved or declined after verification is completed. Once the proctor is approved, both student and proctor will receive a confirmation email at the addresses provided below. Those applications that are incomplete, do not have the required documentation, or do not meet the proctor qualifications will not be approved, and the student will be notified. No exams will be transmitted until a proctor has been approved through this process.</p>",
            "sectionFooterDescription": "<p style=\"text-align:left\"><strong>Examination Administration:</strong></p>\n<ul style=\"text-align:left\">\n<li>The student and the proctor must procure a site appropriate for testing. Exams are not to be administered in a home unless given special exception due to mobility limitations or special needs.</li>\n<li>The exam must remain in the possession of the proctor until the time the test is administered. </li>\n<li>The proctor must verify the identity of the student based on a valid government- issued photo ID before giving an exam.</li>\n<li>The proctor must be present at all times while the exam is being administered.&nbsp; Exam times may not exceed two hours (unless the student requires additional time based on an accommodation approved by the Special Accommodations Coordinator).</li>\n<li>No assistance is allowed. The exam is closed book unless otherwise noted.</li>\n<li>Once started, the examination must be completed. If the student leaves the room before completing the exam, the exam period is ended and the exam must be submitted to the Graduate School USA as is.</li>\n<li>The exam may not be copied by the student under any circumstance. </li>\n<li>Electronic devices (e.g., computers, PDAs, cell phones, pagers, etc.) are <strong>not</strong> permitted in any testing facility.</li>\n<li>Children are <strong>not</strong> allowed in any exam session.</li>\n<li>Students must know their student identification number and include it on the examination.</li>\n<li>The exam may not be copied by a student under any circumstance.</li>\n<li><strong>Immediately upon completion, completed examinations are to be sent to the faculty member in the self-addressed stamped envelope provided by the Registrar.</strong></li>\n</ul>"
          }
    });
  contentfulformServer;

  contentful_forms.getFormWithHeaderAndFooter('JgpDPSNoe4kQGWIkImKAM', function (response, error) {
    expect(response.fields.sectionTitle).to.equal("Proctor Request Form");
  });
  t.end();
});

test('Form route test for Proctor Request Form Internal Error', function (t) {
  var contentfulformServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/JgpDPSNoe4kQGWIkImKAM')
    .reply(500, {
      'accept': 'application/json'
    });
  contentfulformServer;

  contentful_forms.getFormWithHeaderAndFooter('JgpDPSNoe4kQGWIkImKAM', function (response, error) {
    should.exist(error);
    should.not.exist(response);
  });
  t.end();
});

test('Form route test for Certificate Programs Application', function (t) {
  var contentfulformServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/KbQb89jHMWceeoKIGsSgw')
    .reply(200, {
      'accept': 'application/json',
      "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "jzmztwi1xqvn"
            }
          },
          "type": "Entry",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "6XkrlHCU9ysmKsCYGUckAC"
            }
          },
          "id": "KbQb89jHMWceeoKIGsSgw",
          "revision": 1,
          "createdAt": "2015-10-02T14:56:31.284Z",
          "updatedAt": "2015-10-02T14:56:31.284Z",
          "locale": "en-US"
        },
        "fields": {
          "sectionTitle": "Certificate Program Application",
          "sectionHeaderDescription": "<p><strong>Application Process: </strong>\n Fill out this form and submit it online or print it.  You may mail it to Graduate School USA, Office of the Registrar, 600 Maryland Avenue, S.W., Suite 330, Washington, D.C. 20024-2520, or fax it to (202) 479-2501.</p>"
        }
  });
  contentfulformServer;

  contentful_forms.getFormWithHeaderAndFooter('KbQb89jHMWceeoKIGsSgw', function (response, error) {
    expect(response.fields.sectionTitle).to.equal('Certificate Program Application');
  });
  t.end();
});

test('Form route test for  Certificate Programs Application Internal Error', function (t) {
  var contentfulformServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.main.authorization
    }
  }).get('/spaces/'+config("properties").spaces.main.spaceId+'/entries/KbQb89jHMWceeoKIGsSgw')
  .reply(500, {
    'accept': 'application/json'
  });
  contentfulformServer;

  contentful_forms.getFormWithHeaderAndFooter('KbQb89jHMWceeoKIGsSgw', function (response, error) {
    should.exist(error);
    should.not.exist(response);
  });
  t.end();
});
