var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;

test('test for catalog download', function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': 'Bearer 940e9e7a8f323bf2678b762426cc7349f2d0c339f6b6376a19e1b04e93c21652'
    }
    }).get('/spaces/jzmztwi1xqvn/entries?content_type=ZRkwvyMcCqK46gGOggeWs')
    .reply(200, {
      "sys": {
        "type": "Array"
      },
      "total": 4,
      "skip": 0,
      "limit": 100,
      "items": [
        {
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
                "id": "ZRkwvyMcCqK46gGOggeWs"
              }
            },
            "id": "2FJxphiLmwsc2ms6cE2SGc",
            "revision": 2,
            "createdAt": "2015-11-05T17:25:39.585Z",
            "updatedAt": "2015-11-05T17:38:18.719Z",
            "locale": "en-US"
          },
          "fields": {
            "catlogTitle": "Government Training & Professional Development",
            "catlogFileAssets": [
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Asset",
                  "id": "4wAz881nLqwWQWeIugeEIc"
                }
              }
            ],
            "catalogFilter": "gtpd"
          }
        },
        {
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
                "id": "ZRkwvyMcCqK46gGOggeWs"
              }
            },
            "id": "5mDi6iutrOacMk4aSO8kEC",
            "revision": 1,
            "createdAt": "2015-11-05T17:28:17.882Z",
            "updatedAt": "2015-11-05T17:28:17.882Z",
            "locale": "en-US"
          },
          "fields": {
            "catlogTitle": "Academic Programs",
            "catlogFileAssets": [
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Asset",
                  "id": "4QkGqyeizKYS8mAsI8Wui0"
                }
              }
            ],
            "catalogFilter": "ap"
          }
        },
        {
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
                "id": "ZRkwvyMcCqK46gGOggeWs"
              }
            },
            "id": "4t2g2muLHimm6cIkIeAeCw",
            "revision": 1,
            "createdAt": "2015-11-05T17:22:52.598Z",
            "updatedAt": "2015-11-05T17:22:52.598Z",
            "locale": "en-US"
          },
          "fields": {
            "catlogTitle": "Graduate School USA",
            "catalogFilter": "gs",
            "catlogFileAssets": [
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Asset",
                  "id": "4s8EAz3KS4mk8c2G8oWek"
                }
              }
            ]
          }
        },
        {
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
                "id": "ZRkwvyMcCqK46gGOggeWs"
              }
            },
            "id": "YtkJV7avUQ4wUY4usWmq6",
            "revision": 2,
            "createdAt": "2015-11-05T17:30:31.579Z",
            "updatedAt": "2015-11-05T20:02:48.084Z",
            "locale": "en-US"
          },
          "fields": {
            "catlogTitle": "Evening & Weekend Programs",
            "catlogFileAssets": [
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Asset",
                  "id": "Kme6fiTHAkomm4amcWu6Q"
                }
              }
            ],
            "catalogFilter": "ewp"
          }
        }
      ],
      "includes": {
        "Asset": [
          {
            "fields": {
              "file": {
                "fileName": "Nationwide-Schedule-Oct2015-March2016.pdf",
                "contentType": "application/pdf",
                "details": {
                  "size": 2206407
                },
                "url": "//assets.contentful.com/jzmztwi1xqvn/4s8EAz3KS4mk8c2G8oWek/5546f5450f26ea86b6ec7a7b1e35f2e9/Nationwide-Schedule-Oct2015-March2016.pdf"
              },
              "title": "Training & Professional Development *",
              "description": "1"
            },
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "jzmztwi1xqvn"
                }
              },
              "type": "Asset",
              "id": "4s8EAz3KS4mk8c2G8oWek",
              "revision": 2,
              "createdAt": "2015-10-28T20:46:51.507Z",
              "updatedAt": "2015-10-28T20:59:25.531Z",
              "locale": "en-US"
            }
          },
          {
            "fields": {
              "file": {
                "fileName": "NHWinterSchedule.pdf",
                "contentType": "application/pdf",
                "details": {
                  "size": 2066754
                },
                "url": "//assets.contentful.com/jzmztwi1xqvn/4wAz881nLqwWQWeIugeEIc/63be7748626e428973aef012fb407804/NHWinterSchedule.pdf"
              },
              "title": "Natural History Field Studies Winter Term Schedule",
              "description": "5"
            },
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "jzmztwi1xqvn"
                }
              },
              "type": "Asset",
              "id": "4wAz881nLqwWQWeIugeEIc",
              "revision": 3,
              "createdAt": "2015-10-28T20:48:03.301Z",
              "updatedAt": "2015-10-28T21:01:11.678Z",
              "locale": "en-US"
            }
          },
          {
            "fields": {
              "file": {
                "fileName": "GS_Faculty_Handbook_2015-2016.pdf",
                "contentType": "application/pdf",
                "details": {
                  "size": 3223745
                },
                "url": "//assets.contentful.com/jzmztwi1xqvn/4QkGqyeizKYS8mAsI8Wui0/70f0a424afb21bfed47f5770717ae936/GS_Faculty_Handbook_2015-2016.pdf"
              },
              "title": "Academic Programs Faculty Handbook",
              "description": "8"
            },
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "jzmztwi1xqvn"
                }
              },
              "type": "Asset",
              "id": "4QkGqyeizKYS8mAsI8Wui0",
              "revision": 2,
              "createdAt": "2015-10-28T20:57:40.761Z",
              "updatedAt": "2015-10-28T21:02:51.476Z",
              "locale": "en-US"
            }
          },
          {
            "fields": {
              "file": {
                "fileName": "EP_Course_Catalog_2015.pdf",
                "contentType": "application/pdf",
                "details": {
                  "size": 3008225
                },
                "url": "//assets.contentful.com/jzmztwi1xqvn/Kme6fiTHAkomm4amcWu6Q/74e34bc4dbe04782179940a32db39dd6/EP_Course_Catalog_2015.pdf"
              },
              "title": "Evening & Weekend Programs",
              "description": "2"
            },
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "jzmztwi1xqvn"
                }
              },
              "type": "Asset",
              "id": "Kme6fiTHAkomm4amcWu6Q",
              "revision": 2,
              "createdAt": "2015-10-28T20:54:39.685Z",
              "updatedAt": "2015-10-28T20:59:43.684Z",
              "locale": "en-US"
            }
          }
        ]
      }
    });
  contentfulServer;
  contentful.getCatalogDownload(function(response){
    var goodStatus = 200;
    expect(response.statusCode).to.equal(goodStatus);
    expect(response.cmsEntry[0].fields.catlogTitle).to.equal("Government Training & Professional Development");
  });
  t.end();
});
