var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;

var contentfulServerSnippet = nock('https://cdn.contentful.com', {
  reqheaders: {
    'Authorization': 'Bearer a7d20c0466c57d1f2fedb4043f2e7848a7d85bb3327740e3ce2dff5bafdc51f0'
  }
}).get('/spaces/98qeodfc03o0/entries?content_type=vWuB3fpTWge2EU8ec0OOA&fields.slug=snippet/test')
.reply(200, {
  "sys": {
      "type": "Array"
    },
    "total": 1,
    "skip": 0,
    "limit": 100,
    "items": [
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "98qeodfc03o0"
            }
          },
          "type": "Entry",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "vWuB3fpTWge2EU8ec0OOA"
            }
          },
          "id": "6TOGhww8pOWEAugG2kECKC",
          "revision": 2,
          "createdAt": "2015-11-30T19:32:35.604Z",
          "updatedAt": "2015-11-30T21:25:13.238Z",
          "locale": "en-US"
        },
        "fields": {
          "title": "Test Snippet",
          "snippetContent": "Yay, this is a test snippet!",
          "slug": "snippet/test"
        }
      }
    ]
});

// Test case for testing Modal section page type from contentful
test("ContentSnippet testcase includes property Entries", function(t) {
  contentfulServerSnippet;
  contentful.getContentSnippet(function(response), "snippet/test" {
    var type = "Array";
    expect(response.sys.type).to.equal(type);
  });
  t.end();
});

// test("ContentSnippet testcase contains title", function(t) {
//   var contentfulServerSnippet = nock('https://cdn.contentful.com', {
//     reqheaders: {
//       'Authorization': 'Bearer a7d20c0466c57d1f2fedb4043f2e7848a7d85bb3327740e3ce2dff5bafdc51f0'
//     }
//   }).get('/spaces/98qeodfc03o0/entries?content_type=vWuB3fpTWge2EU8ec0OOA')
//   .reply(200, {
//     "sys": {
//         "type": "Array"
//       },
//       "total": 1,
//       "skip": 0,
//       "limit": 100,
//       "items": [
//         {
//           "sys": {
//             "space": {
//               "sys": {
//                 "type": "Link",
//                 "linkType": "Space",
//                 "id": "98qeodfc03o0"
//               }
//             },
//             "type": "Entry",
//             "contentType": {
//               "sys": {
//                 "type": "Link",
//                 "linkType": "ContentType",
//                 "id": "vWuB3fpTWge2EU8ec0OOA"
//               }
//             },
//             "id": "6TOGhww8pOWEAugG2kECKC",
//             "revision": 2,
//             "createdAt": "2015-11-30T19:32:35.604Z",
//             "updatedAt": "2015-11-30T21:25:13.238Z",
//             "locale": "en-US"
//           },
//           "fields": {
//             "title": "Test Snippet",
//             "snippetContent": "Yay, this is a test snippet!",
//             "slug": "snippet/test"
//           }
//         }
//       ]
//   });
//   contentfulServerSnippet;
//   contentful.getContentSnippet(function(response) {
//     expect(response.includes.Entry).to.exist;
//   });
//   t.end();
