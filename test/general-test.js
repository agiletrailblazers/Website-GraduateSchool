var chai = require('chai');
var expect = require('chai').expect;
var contentful = require("../API/contentful.js");
var nock = require('nock');
var should = require("should");
var test = require('tap').test;
var config = require('konphyg')(__dirname + '/../config');

var contentfulServer = nock('https://cdn.contentful.com', {
  reqheaders: {
    'Authorization': config("properties").spaces.faq.authorization
  }
}).get('/spaces/'+config("properties").spaces.faq.spaceId+'/entries?content_type=5Qnph4LqeWyqy2aeQmes4y&fields.slug=training-officials')
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
              "id": "2v0dv55ahz7w"
            }
          },
          "type": "Entry",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "5Qnph4LqeWyqy2aeQmes4y"
            }
          },
          "id": "4N01JUaq64qk2m8YMooc2Y",
          "revision": 4,
          "createdAt": "2015-11-02T15:24:12.862Z",
          "updatedAt": "2015-11-04T20:54:15.698Z",
          "locale": "en-US"
        },
        "fields": {
          "slug": "training-officials",
          "title": "Training Officials",
          "questions": [
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "62sl899JoAiGywSQqWaIiE"
              }
            }
          ],
          "order": 4
        }
      }
    ],
    "includes": {
      "Entry": [
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "62sl899JoAiGywSQqWaIiE",
            "revision": 6,
            "createdAt": "2015-10-30T13:58:29.265Z",
            "updatedAt": "2015-11-04T19:23:43.443Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "how-do-i-request-a-transcript",
            "title": "How do I request a transcript?",
            "question": "How do I request a transcript?",
            "answer": "The Graduate School does not fax or email official transcript copies. Unofficial copies of transcripts may be emailed or faxed for $3.00 each. Official transcripts (affixed with the Graduate School Seal) are $5.00 each. Rush transcripts, processed in two business days are $15.00 each. All may be obtained by submitting a completed, signed transcript request form with payment to:&nbsp;\n    <p>\n        Office of the Registrar\n        <br>\n        Graduate School\n        <br>\n        600 Maryland Avenue, S.W., Suite 330\n        <br>\n        Washington, DC 20025-2520",
            "categories": null
          }
        }
      ]
    }
  });


test("faq category testcase returns an array", function(t) {
  contentfulServer;
  contentful.getFAQCategory("training-officials", function(response) {
    var type = "Array";
    expect(response.sys.type).to.equal(type);
  });
  t.end();
});

test("faq category testcase includes property Entries", function(t) {
  var contentfulServer = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': config("properties").spaces.faq.authorization
    }
  }).get('/spaces/'+config("properties").spaces.faq.spaceId+'/entries?content_type=5Qnph4LqeWyqy2aeQmes4y&fields.slug=training-officials')
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
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "5Qnph4LqeWyqy2aeQmes4y"
              }
            },
            "id": "4N01JUaq64qk2m8YMooc2Y",
            "revision": 4,
            "createdAt": "2015-11-02T15:24:12.862Z",
            "updatedAt": "2015-11-04T20:54:15.698Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "training-officials",
            "title": "Training Officials",
            "questions": [
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "62sl899JoAiGywSQqWaIiE"
                }
              }
            ],
            "order": 4
          }
        }
      ],
      "includes": {
        "Entry": [
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "62sl899JoAiGywSQqWaIiE",
              "revision": 6,
              "createdAt": "2015-10-30T13:58:29.265Z",
              "updatedAt": "2015-11-04T19:23:43.443Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "how-do-i-request-a-transcript",
              "title": "How do I request a transcript?",
              "question": "How do I request a transcript?",
              "answer": "The Graduate School does not fax or email official transcript copies. Unofficial copies of transcripts may be emailed or faxed for $3.00 each. Official transcripts (affixed with the Graduate School Seal) are $5.00 each. Rush transcripts, processed in two business days are $15.00 each. All may be obtained by submitting a completed, signed transcript request form with payment to:&nbsp;\n    <p>\n        Office of the Registrar\n        <br>\n        Graduate School\n        <br>\n        600 Maryland Avenue, S.W., Suite 330\n        <br>\n        Washington, DC 20025-2520",
              "categories": null
            }
          }
        ]
      }
    });
  contentfulServer;
  contentful.getFAQCategory("training-officials", function(response) {
    expect(response.includes.Entry).to.exist;
  });
  t.end();
});

var contentfulServerFaq = nock('https://cdn.contentful.com', {
  reqheaders: {
    'Authorization': 'Bearer eb55e283a78dc7e297091e733bf374948b3361e74e6f36d36e8f880ce20a1467'
  }
}).get('/spaces/2v0dv55ahz7w/entries?content_type=5Qnph4LqeWyqy2aeQmes4y')
  .reply(200,{
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
              "id": "2v0dv55ahz7w"
            }
          },
          "type": "Entry",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "5Qnph4LqeWyqy2aeQmes4y"
            }
          },
          "id": "6MMtfgdzkQoaUYSE0qYkyc",
          "revision": 3,
          "createdAt": "2015-10-30T14:06:48.579Z",
          "updatedAt": "2015-11-04T20:53:25.575Z",
          "locale": "en-US"
        },
        "fields": {
          "slug": "general",
          "title": "General",
          "questions": [
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "J2EYQFsBQAEuSCwMIa4Aw"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "5YnqnIhak86mCMgQOEaoQi"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "ZWzMRhdemGKy42uku62I6"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "3KHSS0LhRmK6mmCaO6OCeg"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "1BIkqlUcQgiYKcSkMawasO"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "1zVvvhFZAomEi4uYeK6G66"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "3zmYeusLOoyW4m0SqA6QKG"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "5Ri4b95sOIW2wAyW88cqqk"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "7APuod1m6sGYKcQEemGoWk"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "buVuLqITy8SeyqMosuiOw"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "aNgEwQVKFyy2qq2SA4og4"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "FAvOGQzXa0i00CygIYWSy"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "6G4nz3PZ7OIsMKSKAyyOKQ"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "62sl899JoAiGywSQqWaIiE"
              }
            },
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "1dsMR1t2JkkW8yM0GauM4a"
              }
            }
          ],
          "order": 1
        }
      },
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "2v0dv55ahz7w"
            }
          },
          "type": "Entry",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "5Qnph4LqeWyqy2aeQmes4y"
            }
          },
          "id": "2m3flydlMQ0asAm4aOA8Y8",
          "revision": 3,
          "createdAt": "2015-11-02T15:24:03.037Z",
          "updatedAt": "2015-11-04T20:53:45.857Z",
          "locale": "en-US"
        },
        "fields": {
          "slug": "evening-and-weekend-courses",
          "title": "Evening and Weekend Courses",
          "questions": [
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "62sl899JoAiGywSQqWaIiE"
              }
            }
          ],
          "order": 2
        }
      },
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "2v0dv55ahz7w"
            }
          },
          "type": "Entry",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "5Qnph4LqeWyqy2aeQmes4y"
            }
          },
          "id": "6RERYmqCXYy4iGI42Ky6Kc",
          "revision": 3,
          "createdAt": "2015-11-02T15:23:41.129Z",
          "updatedAt": "2015-11-04T20:54:01.261Z",
          "locale": "en-US"
        },
        "fields": {
          "slug": "certificate-programs",
          "title": "Certificate Programs",
          "questions": [
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "62sl899JoAiGywSQqWaIiE"
              }
            }
          ],
          "order": 3
        }
      },
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "2v0dv55ahz7w"
            }
          },
          "type": "Entry",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "5Qnph4LqeWyqy2aeQmes4y"
            }
          },
          "id": "4N01JUaq64qk2m8YMooc2Y",
          "revision": 4,
          "createdAt": "2015-11-02T15:24:12.862Z",
          "updatedAt": "2015-11-04T20:54:15.698Z",
          "locale": "en-US"
        },
        "fields": {
          "slug": "training-officials",
          "title": "Training Officials",
          "questions": [
            {
              "sys": {
                "type": "Link",
                "linkType": "Entry",
                "id": "62sl899JoAiGywSQqWaIiE"
              }
            }
          ],
          "order": 4
        }
      }
    ],
    "includes": {
      "Entry": [
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "aNgEwQVKFyy2qq2SA4og4",
            "revision": 1,
            "createdAt": "2015-10-30T13:59:42.856Z",
            "updatedAt": "2015-10-30T13:59:42.856Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "how-can-i-bring-a-course-or-program-to-my-agency",
            "title": "How can I bring a course or program to my agency?",
            "question": "How can I bring a course or program to my agency?",
            "answer": "The Graduate School can bring our courses and programs to your agency for groups of five participants or more. For more information, please e-mail us at or find the course you would like brought on-site in our online course catalog and fill out the on-site request form located on the course description page. We can also customize any of our courses. Read more about our Customized Services.\n"
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "FAvOGQzXa0i00CygIYWSy",
            "revision": 1,
            "createdAt": "2015-10-30T13:59:23.667Z",
            "updatedAt": "2015-10-30T13:59:23.667Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "how-do-i-find-a-course",
            "title": "How do I find a course?",
            "answer": "All of our courses are listed in our online course catalog. You can search by location, keyword, title, course code, training type or time of year. If you can’t find the course you are looking for, please call the Customer Service Center at (888) 744-GRAD, and we’ll help you find what you’re looking for.",
            "question": "How do I find a course?"
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "6G4nz3PZ7OIsMKSKAyyOKQ",
            "revision": 1,
            "createdAt": "2015-10-30T13:58:59.887Z",
            "updatedAt": "2015-10-30T13:58:59.887Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "can-you-confirm-if-i-m-registered-for-a-course",
            "title": "Can you confirm if I’m registered for a course?",
            "answer": "To check if you are confirmed for a course, please contact the Customer Service Center at (888) 744-GRAD.",
            "question": "Can you confirm if I’m registered for a course?"
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "buVuLqITy8SeyqMosuiOw",
            "revision": 1,
            "createdAt": "2015-10-30T14:00:03.543Z",
            "updatedAt": "2015-10-30T14:00:03.543Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "are-you-accredited-what-other-approvals-do-you-have",
            "title": "Are you accredited? What other approvals do you have?",
            "answer": "Effective November 2012, Graduate School USA is a Candidate for Accreditation by the Middle States Commission on Higher Education, 3624 Market Street, Philadelphia, PA 19104 (267) 284-5000. Some Graduate School courses have been designated to receive college credit recommended by the ACE College Credit Recommendation Service. Adults who wish to pursue outside degree programs should verify with their college or university which credits will transfer before registering for courses at the Graduate School.",
            "question": "Are you accredited? What other approvals do you have?"
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "3zmYeusLOoyW4m0SqA6QKG",
            "revision": 1,
            "createdAt": "2015-10-30T14:01:14.480Z",
            "updatedAt": "2015-10-30T14:01:14.480Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "what-are-the-class-hours",
            "title": "What are the class hours?",
            "question": "What are the class hours?",
            "answer": "Class hours may vary; please check your confirmation email for exact class times.\n\nIn general, most daytime courses are conducted from 8:30 a.m. to 4 p.m., except for most CPE-designated courses, which run from 8:30 a.m. to 4:30 p.m.\n\nMost Evening and Weekend program courses are held from once a week from 6:00 p.m. to 9:00 p.m. (Monday-Thursday) or Saturday from 9:00 a.m. to noon.\n\nPlease see the Academic Programs Division Course Schedule for exact class hours."
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "5Ri4b95sOIW2wAyW88cqqk",
            "revision": 1,
            "createdAt": "2015-10-30T14:00:54.180Z",
            "updatedAt": "2015-10-30T14:00:54.180Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "where-do-i-find-a-list-of-all-classes-being-held-in-a-specific-city",
            "title": "Where do I find a list of all classes being held in a specific city?",
            "question": "Where do I find a list of all classes being held in a specific city?",
            "answer": "Use the __View classes offered at this location__ link found with each location in our Training Locations and Hotels listing, or use the City Search option at the bottom of Course Search to locate classes by city, state, date, etc."
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "1BIkqlUcQgiYKcSkMawasO",
            "revision": 1,
            "createdAt": "2015-10-30T14:02:19.735Z",
            "updatedAt": "2015-10-30T14:02:19.735Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "can-i-buy-the-course-materials-without-taking-the-course",
            "title": "Can I buy the course materials without taking the course?",
            "question": "Can I buy the course materials without taking the course?",
            "answer": "Unless otherwise available commercially, materials for Graduate School courses cannot be purchased without taking the course."
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "7APuod1m6sGYKcQEemGoWk",
            "revision": 1,
            "createdAt": "2015-10-30T14:00:29.531Z",
            "updatedAt": "2015-10-30T14:00:29.531Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "how-do-i-find-a-hotel-near-a-training-facility",
            "title": "How do I find a hotel near a training facility?",
            "question": "How do I find a hotel near a training facility?",
            "answer": "Please visit the Training Locations and Hotels section of our Web site to locate information on cities and states."
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "J2EYQFsBQAEuSCwMIa4Aw",
            "revision": 1,
            "createdAt": "2015-10-30T14:02:40.605Z",
            "updatedAt": "2015-10-30T14:02:40.605Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "im-in-private-industry-would-your-courses-be-of-benefit-to-me",
            "title": "I'm in private industry. Would your courses be of benefit to me?",
            "answer": "Yes. While most of the Graduate School human resource development, financial management and management sciences courses are structured to meet the workforce needs of federal government agencies and government contractors, you may find the courses useful for gaining knowledge of federal government rules, requirements and philosophies. Also, most of our communication skills, computer skills, leadership development, and supervisory/management courses may be appropriate for you. And if you are preparing to continue your education, and need a foundation in mathematics, statistics, foreign languages, writing, and economics, the Evening and Weekend Programs of the Graduate School offers ACE Reviewed courses in these areas. The Graduate School Evening Programs is a great place to return to school in a non-threatening environment and explore your possibilities at a reasonable cost through a stellar faculty and classroom experience.",
            "question": "I'm in private industry. Would your courses be of benefit to me?"
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "3KHSS0LhRmK6mmCaO6OCeg",
            "revision": 1,
            "createdAt": "2015-10-30T14:03:51.394Z",
            "updatedAt": "2015-10-30T14:03:51.394Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "i-m-a-former-seu-student-where-can-i-get-a-copy-of-my-transcript-or-more",
            "title": "I’m a former SEU student. Where can I get a copy of my transcript or more information?",
            "question": "I’m a former SEU student. Where can I get a copy of my transcript or more information?",
            "answer": "In August 2009, Southeastern University (Washington, DC) closed its doors. Graduate School USA has custody of all SEU students’ academic and financial records. Please visit our Southeastern University Information page for more information on transcript requests, enrollment/education verifications, degree verifications, and duplicate diploma requests."
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "ZWzMRhdemGKy42uku62I6",
            "revision": 1,
            "createdAt": "2015-10-30T14:03:00.404Z",
            "updatedAt": "2015-10-30T14:03:00.404Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "do-you-have-any-guidance-on-participant-attendance-during-a-training",
            "title": "Do you have any guidance on participant attendance during a training session? Will I receive a certificate of course completion if I miss class time?",
            "question": "Do you have any guidance on participant attendance during a training session? Will I receive a certificate of course completion if I miss class time?",
            "answer": "Courses are conducted from 8:30 a.m. to 4 p.m., except for most CPE designated courses, which run from 8:30 a.m. to 4:30 p.m. Participants are expected to complete the entire course and should make their travel arrangements accordingly. Failure to attend the entire course may result in your not receiving a certificate of completion for the course.\n"
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "1zVvvhFZAomEi4uYeK6G66",
            "revision": 2,
            "createdAt": "2015-10-30T14:02:01.900Z",
            "updatedAt": "2015-11-04T16:48:52.097Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "as-a-participant-with-a-special-accommodation-need-ada-how-do-i-request",
            "title": "As a participant with a special accommodation need (ADA), how do I request this service?",
            "question": "As a participant with a special accommodation need (ADA), how do I request this service?",
            "answer": "Disability Services\nThe Graduate School fully complies with Section 504 of the Rehabilitation Act of 1973 and the Americans with Disabilities Act of 1990 and does not discriminate on the basis of disability. The Special Accommodations Coordinator in the Office of the Registrar manages a variety of support services for students with disabilities and/or special requirements. \n\nServices are coordinated to fit the individual needs of the student and may include sign language interpreters, Braille, electronic format (large print, Word or PDF), computer-aided real-time translation (CART) services, notetaking services, testing accommodations, and use of assistive technology. Academic advising, priority registration, and referral information are also available. Students requesting services are responsible for providing current documentation from a qualified professional verifying the disability and its impact on academic performance. New students are encouraged to contact the Special Accommodations Coordinator in the Office of the Registrar at least one month prior to registration.\n\nStudents requiring assistance and accommodation should complete the Special Accommodation Request form and submit the form to the Office of the Registrar. The Special Accommodations Coordinator may be reached at (202) 314-3349 or registrar@graduateschool.edu and by TDD at (888) 744-2717.\n\nYou must be officially enrolled in a class to initiate any ADA accommodations request. Please plan ahead to contact the Registrar’s Office at least four weeks before the course or program begins to discuss your specific needs and arrangements. \n\nTo request accommodations online, find the course and session for which you are registered in our online course catalog.\nVisit the course catalog and select the session for which you are registering\n1. Click on the \"Register/Inquire\" button\n2. Click on the \"Submit ADA Requirements\" link\n3. Click on the \"Submit ADA Requirements\" button"
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "1dsMR1t2JkkW8yM0GauM4a",
            "revision": 8,
            "createdAt": "2015-10-30T13:57:53.391Z",
            "updatedAt": "2015-11-04T18:46:32.080Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "who-can-take-classes-at-the-graduate-school",
            "title": "Who can take classes at the Graduate School?",
            "question": "Who can take classes at the Graduate School?",
            "answer": "<ol start=\"1\" type=\"1\">\n    <li>\n      <strong><em>Non-credit Courses:</em></strong><br>\n        For non-credit courses, the Graduate School has an open enrollment admissions policy\n        and does not require an admission application or fee. These courses are open to\n        anyone at least 18 years of age, regardless of educational background or place of\n        employment. Some courses have prerequisites included with the course description.\n        For these courses, participants are responsible for meeting the required prerequisites\n        or having the appropriate prior experience. Please note that our <a href=\"http://graduateschool.edu/index.php?option=com_content&amp;task=view&amp;id=188&amp;Itemid=200\">\n            leadership development programs</a> require <a href=\"http://graduateschool.edu/index.php?option=com_content&amp;task=view&amp;id=158\">\n                special application packages</a>. The Graduate School is an <a href=\"http://graduateschool.edu/index.php?option=com_content&amp;task=view&amp;id=362\">\n                    equal opportunity</a> provider and employer. We make every practical\n        effort to ensure that our programs are <a href=\"http://graduateschool.edu/index.php?option=com_content&amp;task=view&amp;id=146&amp;itemid=204\">\n            accessible</a> to physically challenged participants and participants with special\n        needs. We must receive your <a href=\"http://graduateschool.edu/index.php?option=com_content&amp;task=view&amp;id=385&amp;Itemid=174\">\n            payment or payment information</a> before we can process a registration application.\n        <strong>\n            <br>\n        </strong>\n        <br>\n        <br>\n        <strong><em>Credit Program Admissions:</em></strong><br>\n        The following admission requirements apply to the admission of students who intend\n        to enroll in courses for academic credit.</li>\n    <p>\n        Undergraduate students are required to be twenty-one (21) years of age or older\n        and meet at least <strong>one</strong> of the following admission standards:</p>\n    <ul>\n        <li>Earned a high school diploma with a grade point average (GPA) of 2.0 or above on\n            a 4.0 scale</li>\n        <li>Possess a General Equivalency Diploma (GED)</li>\n        <!--<li>Have matriculated at a post-secondary  institution and earned a grade of C or better in a college level course in  English and Mathematics</li>-->\n    </ul>\n    <p>\n        All applicants must submit an admission application with required non-refundable\n        application fee.</p>\n    <p>\n        <strong><em>Admission of Home-Schooled Students:</em></strong><br>\n        The Graduate School welcomes home-schooled students to apply for undergraduate admission.\n        Home-schooled applicants with an official GED must submit the following:</p>\n    <ul>\n        <li>Undergraduate application with required non-refundable application fee; </li>\n        <li>Official GED scores; and,</li>\n        <li>Official transcripts if the applicant has taken courses through a secondary or post-secondary\n            institution.</li>\n    </ul>\n    <p>\n        If a home-schooled student does not have an official GED score, then under the student\n        eligibility provisions of the Higher Education Opportunity Act the applicant must\n        provide verification of completion of high school, and may do so through:</p>\n    <ul>\n        <li>Home school transcripts with letter of completion;</li>\n        <li>Transcripts from regionally accredited home school program with certification of\n            completion and proof that the home school program is registered or recognized by\n            its own state department of education; or, </li>\n        <li>Written verification from appropriate school district that the student has met requirements\n            for a high school diploma in his/her home state.</li>\n    </ul>\n    <p>\n        Home-schooled students who earn diplomas through regionally accredited schools are\n        considered for admission under the School’s standard admissions policies based on\n        GPA.<br>\n    </p>\n</ol>",
            "categories": [
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "2m3flydlMQ0asAm4aOA8Y8"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "6RERYmqCXYy4iGI42Ky6Kc"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "4N01JUaq64qk2m8YMooc2Y"
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
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "5YnqnIhak86mCMgQOEaoQi",
            "revision": 5,
            "createdAt": "2015-10-30T14:03:23.885Z",
            "updatedAt": "2015-11-04T19:23:44.784Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "is-there-a-customer-satisfaction-guarantee-policy",
            "title": "Is there a customer satisfaction guarantee policy?",
            "question": "Is there a customer satisfaction guarantee policy?",
            "answer": "Yes, we have always guaranteed the quality of our courses and services and are proud that over two million participants have completed the courses we have conducted since 1921. Our courses and the other services we offer consistently receive high ratings for being well delivered, relevant and timely. If you are not satisfied that we have met the stated objectives of the course or services performed, just contact us to tell us why. We will either give you a refund or apply the amount toward the fee for another Graduate School course or service.",
            "categories": null,
            "cat2": null
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "8c6nGKy83S6aQukwgkqgq"
              }
            },
            "id": "62sl899JoAiGywSQqWaIiE",
            "revision": 6,
            "createdAt": "2015-10-30T13:58:29.265Z",
            "updatedAt": "2015-11-04T19:23:43.443Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "how-do-i-request-a-transcript",
            "title": "How do I request a transcript?",
            "question": "How do I request a transcript?",
            "answer": "The Graduate School does not fax or email official transcript copies. Unofficial copies of transcripts may be emailed or faxed for $3.00 each. Official transcripts (affixed with the Graduate School Seal) are $5.00 each. Rush transcripts, processed in two business days are $15.00 each. All may be obtained by submitting a completed, signed transcript request form with payment to:&nbsp;\n    <p>\n        Office of the Registrar\n        <br>\n        Graduate School\n        <br>\n        600 Maryland Avenue, S.W., Suite 330\n        <br>\n        Washington, DC 20025-2520",
            "categories": null
          }
        }
      ]
    }
  });

test("faq testcase includes property Entries", function(t) {
  contentfulServerFaq;
  contentful.getFAQ(function(response) {
    expect(response.includes.Entry).to.exist;
  });
  t.end();
});

test("faq testcase contains title", function(t) {
  var contentfulServerFaq = nock('https://cdn.contentful.com', {
    reqheaders: {
      'Authorization': 'Bearer eb55e283a78dc7e297091e733bf374948b3361e74e6f36d36e8f880ce20a1467'
    }
  }).get('/spaces/2v0dv55ahz7w/entries?content_type=5Qnph4LqeWyqy2aeQmes4y')
    .reply(200,{
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
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "5Qnph4LqeWyqy2aeQmes4y"
              }
            },
            "id": "6MMtfgdzkQoaUYSE0qYkyc",
            "revision": 3,
            "createdAt": "2015-10-30T14:06:48.579Z",
            "updatedAt": "2015-11-04T20:53:25.575Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "general",
            "title": "General",
            "questions": [
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "J2EYQFsBQAEuSCwMIa4Aw"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "5YnqnIhak86mCMgQOEaoQi"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "ZWzMRhdemGKy42uku62I6"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "3KHSS0LhRmK6mmCaO6OCeg"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "1BIkqlUcQgiYKcSkMawasO"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "1zVvvhFZAomEi4uYeK6G66"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "3zmYeusLOoyW4m0SqA6QKG"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "5Ri4b95sOIW2wAyW88cqqk"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "7APuod1m6sGYKcQEemGoWk"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "buVuLqITy8SeyqMosuiOw"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "aNgEwQVKFyy2qq2SA4og4"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "FAvOGQzXa0i00CygIYWSy"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "6G4nz3PZ7OIsMKSKAyyOKQ"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "62sl899JoAiGywSQqWaIiE"
                }
              },
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "1dsMR1t2JkkW8yM0GauM4a"
                }
              }
            ],
            "order": 1
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "5Qnph4LqeWyqy2aeQmes4y"
              }
            },
            "id": "2m3flydlMQ0asAm4aOA8Y8",
            "revision": 3,
            "createdAt": "2015-11-02T15:24:03.037Z",
            "updatedAt": "2015-11-04T20:53:45.857Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "evening-and-weekend-courses",
            "title": "Evening and Weekend Courses",
            "questions": [
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "62sl899JoAiGywSQqWaIiE"
                }
              }
            ],
            "order": 2
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "5Qnph4LqeWyqy2aeQmes4y"
              }
            },
            "id": "6RERYmqCXYy4iGI42Ky6Kc",
            "revision": 3,
            "createdAt": "2015-11-02T15:23:41.129Z",
            "updatedAt": "2015-11-04T20:54:01.261Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "certificate-programs",
            "title": "Certificate Programs",
            "questions": [
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "62sl899JoAiGywSQqWaIiE"
                }
              }
            ],
            "order": 3
          }
        },
        {
          "sys": {
            "space": {
              "sys": {
                "type": "Link",
                "linkType": "Space",
                "id": "2v0dv55ahz7w"
              }
            },
            "type": "Entry",
            "contentType": {
              "sys": {
                "type": "Link",
                "linkType": "ContentType",
                "id": "5Qnph4LqeWyqy2aeQmes4y"
              }
            },
            "id": "4N01JUaq64qk2m8YMooc2Y",
            "revision": 4,
            "createdAt": "2015-11-02T15:24:12.862Z",
            "updatedAt": "2015-11-04T20:54:15.698Z",
            "locale": "en-US"
          },
          "fields": {
            "slug": "training-officials",
            "title": "Training Officials",
            "questions": [
              {
                "sys": {
                  "type": "Link",
                  "linkType": "Entry",
                  "id": "62sl899JoAiGywSQqWaIiE"
                }
              }
            ],
            "order": 4
          }
        }
      ],
      "includes": {
        "Entry": [
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "aNgEwQVKFyy2qq2SA4og4",
              "revision": 1,
              "createdAt": "2015-10-30T13:59:42.856Z",
              "updatedAt": "2015-10-30T13:59:42.856Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "how-can-i-bring-a-course-or-program-to-my-agency",
              "title": "How can I bring a course or program to my agency?",
              "question": "How can I bring a course or program to my agency?",
              "answer": "The Graduate School can bring our courses and programs to your agency for groups of five participants or more. For more information, please e-mail us at or find the course you would like brought on-site in our online course catalog and fill out the on-site request form located on the course description page. We can also customize any of our courses. Read more about our Customized Services.\n"
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "FAvOGQzXa0i00CygIYWSy",
              "revision": 1,
              "createdAt": "2015-10-30T13:59:23.667Z",
              "updatedAt": "2015-10-30T13:59:23.667Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "how-do-i-find-a-course",
              "title": "How do I find a course?",
              "answer": "All of our courses are listed in our online course catalog. You can search by location, keyword, title, course code, training type or time of year. If you can’t find the course you are looking for, please call the Customer Service Center at (888) 744-GRAD, and we’ll help you find what you’re looking for.",
              "question": "How do I find a course?"
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "6G4nz3PZ7OIsMKSKAyyOKQ",
              "revision": 1,
              "createdAt": "2015-10-30T13:58:59.887Z",
              "updatedAt": "2015-10-30T13:58:59.887Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "can-you-confirm-if-i-m-registered-for-a-course",
              "title": "Can you confirm if I’m registered for a course?",
              "answer": "To check if you are confirmed for a course, please contact the Customer Service Center at (888) 744-GRAD.",
              "question": "Can you confirm if I’m registered for a course?"
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "buVuLqITy8SeyqMosuiOw",
              "revision": 1,
              "createdAt": "2015-10-30T14:00:03.543Z",
              "updatedAt": "2015-10-30T14:00:03.543Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "are-you-accredited-what-other-approvals-do-you-have",
              "title": "Are you accredited? What other approvals do you have?",
              "answer": "Effective November 2012, Graduate School USA is a Candidate for Accreditation by the Middle States Commission on Higher Education, 3624 Market Street, Philadelphia, PA 19104 (267) 284-5000. Some Graduate School courses have been designated to receive college credit recommended by the ACE College Credit Recommendation Service. Adults who wish to pursue outside degree programs should verify with their college or university which credits will transfer before registering for courses at the Graduate School.",
              "question": "Are you accredited? What other approvals do you have?"
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "3zmYeusLOoyW4m0SqA6QKG",
              "revision": 1,
              "createdAt": "2015-10-30T14:01:14.480Z",
              "updatedAt": "2015-10-30T14:01:14.480Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "what-are-the-class-hours",
              "title": "What are the class hours?",
              "question": "What are the class hours?",
              "answer": "Class hours may vary; please check your confirmation email for exact class times.\n\nIn general, most daytime courses are conducted from 8:30 a.m. to 4 p.m., except for most CPE-designated courses, which run from 8:30 a.m. to 4:30 p.m.\n\nMost Evening and Weekend program courses are held from once a week from 6:00 p.m. to 9:00 p.m. (Monday-Thursday) or Saturday from 9:00 a.m. to noon.\n\nPlease see the Academic Programs Division Course Schedule for exact class hours."
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "5Ri4b95sOIW2wAyW88cqqk",
              "revision": 1,
              "createdAt": "2015-10-30T14:00:54.180Z",
              "updatedAt": "2015-10-30T14:00:54.180Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "where-do-i-find-a-list-of-all-classes-being-held-in-a-specific-city",
              "title": "Where do I find a list of all classes being held in a specific city?",
              "question": "Where do I find a list of all classes being held in a specific city?",
              "answer": "Use the __View classes offered at this location__ link found with each location in our Training Locations and Hotels listing, or use the City Search option at the bottom of Course Search to locate classes by city, state, date, etc."
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "1BIkqlUcQgiYKcSkMawasO",
              "revision": 1,
              "createdAt": "2015-10-30T14:02:19.735Z",
              "updatedAt": "2015-10-30T14:02:19.735Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "can-i-buy-the-course-materials-without-taking-the-course",
              "title": "Can I buy the course materials without taking the course?",
              "question": "Can I buy the course materials without taking the course?",
              "answer": "Unless otherwise available commercially, materials for Graduate School courses cannot be purchased without taking the course."
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "7APuod1m6sGYKcQEemGoWk",
              "revision": 1,
              "createdAt": "2015-10-30T14:00:29.531Z",
              "updatedAt": "2015-10-30T14:00:29.531Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "how-do-i-find-a-hotel-near-a-training-facility",
              "title": "How do I find a hotel near a training facility?",
              "question": "How do I find a hotel near a training facility?",
              "answer": "Please visit the Training Locations and Hotels section of our Web site to locate information on cities and states."
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "J2EYQFsBQAEuSCwMIa4Aw",
              "revision": 1,
              "createdAt": "2015-10-30T14:02:40.605Z",
              "updatedAt": "2015-10-30T14:02:40.605Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "im-in-private-industry-would-your-courses-be-of-benefit-to-me",
              "title": "I'm in private industry. Would your courses be of benefit to me?",
              "answer": "Yes. While most of the Graduate School human resource development, financial management and management sciences courses are structured to meet the workforce needs of federal government agencies and government contractors, you may find the courses useful for gaining knowledge of federal government rules, requirements and philosophies. Also, most of our communication skills, computer skills, leadership development, and supervisory/management courses may be appropriate for you. And if you are preparing to continue your education, and need a foundation in mathematics, statistics, foreign languages, writing, and economics, the Evening and Weekend Programs of the Graduate School offers ACE Reviewed courses in these areas. The Graduate School Evening Programs is a great place to return to school in a non-threatening environment and explore your possibilities at a reasonable cost through a stellar faculty and classroom experience.",
              "question": "I'm in private industry. Would your courses be of benefit to me?"
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "3KHSS0LhRmK6mmCaO6OCeg",
              "revision": 1,
              "createdAt": "2015-10-30T14:03:51.394Z",
              "updatedAt": "2015-10-30T14:03:51.394Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "i-m-a-former-seu-student-where-can-i-get-a-copy-of-my-transcript-or-more",
              "title": "I’m a former SEU student. Where can I get a copy of my transcript or more information?",
              "question": "I’m a former SEU student. Where can I get a copy of my transcript or more information?",
              "answer": "In August 2009, Southeastern University (Washington, DC) closed its doors. Graduate School USA has custody of all SEU students’ academic and financial records. Please visit our Southeastern University Information page for more information on transcript requests, enrollment/education verifications, degree verifications, and duplicate diploma requests."
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "ZWzMRhdemGKy42uku62I6",
              "revision": 1,
              "createdAt": "2015-10-30T14:03:00.404Z",
              "updatedAt": "2015-10-30T14:03:00.404Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "do-you-have-any-guidance-on-participant-attendance-during-a-training",
              "title": "Do you have any guidance on participant attendance during a training session? Will I receive a certificate of course completion if I miss class time?",
              "question": "Do you have any guidance on participant attendance during a training session? Will I receive a certificate of course completion if I miss class time?",
              "answer": "Courses are conducted from 8:30 a.m. to 4 p.m., except for most CPE designated courses, which run from 8:30 a.m. to 4:30 p.m. Participants are expected to complete the entire course and should make their travel arrangements accordingly. Failure to attend the entire course may result in your not receiving a certificate of completion for the course.\n"
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "1zVvvhFZAomEi4uYeK6G66",
              "revision": 2,
              "createdAt": "2015-10-30T14:02:01.900Z",
              "updatedAt": "2015-11-04T16:48:52.097Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "as-a-participant-with-a-special-accommodation-need-ada-how-do-i-request",
              "title": "As a participant with a special accommodation need (ADA), how do I request this service?",
              "question": "As a participant with a special accommodation need (ADA), how do I request this service?",
              "answer": "Disability Services\nThe Graduate School fully complies with Section 504 of the Rehabilitation Act of 1973 and the Americans with Disabilities Act of 1990 and does not discriminate on the basis of disability. The Special Accommodations Coordinator in the Office of the Registrar manages a variety of support services for students with disabilities and/or special requirements. \n\nServices are coordinated to fit the individual needs of the student and may include sign language interpreters, Braille, electronic format (large print, Word or PDF), computer-aided real-time translation (CART) services, notetaking services, testing accommodations, and use of assistive technology. Academic advising, priority registration, and referral information are also available. Students requesting services are responsible for providing current documentation from a qualified professional verifying the disability and its impact on academic performance. New students are encouraged to contact the Special Accommodations Coordinator in the Office of the Registrar at least one month prior to registration.\n\nStudents requiring assistance and accommodation should complete the Special Accommodation Request form and submit the form to the Office of the Registrar. The Special Accommodations Coordinator may be reached at (202) 314-3349 or registrar@graduateschool.edu and by TDD at (888) 744-2717.\n\nYou must be officially enrolled in a class to initiate any ADA accommodations request. Please plan ahead to contact the Registrar’s Office at least four weeks before the course or program begins to discuss your specific needs and arrangements. \n\nTo request accommodations online, find the course and session for which you are registered in our online course catalog.\nVisit the course catalog and select the session for which you are registering\n1. Click on the \"Register/Inquire\" button\n2. Click on the \"Submit ADA Requirements\" link\n3. Click on the \"Submit ADA Requirements\" button"
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "1dsMR1t2JkkW8yM0GauM4a",
              "revision": 8,
              "createdAt": "2015-10-30T13:57:53.391Z",
              "updatedAt": "2015-11-04T18:46:32.080Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "who-can-take-classes-at-the-graduate-school",
              "title": "Who can take classes at the Graduate School?",
              "question": "Who can take classes at the Graduate School?",
              "answer": "<ol start=\"1\" type=\"1\">\n    <li>\n      <strong><em>Non-credit Courses:</em></strong><br>\n        For non-credit courses, the Graduate School has an open enrollment admissions policy\n        and does not require an admission application or fee. These courses are open to\n        anyone at least 18 years of age, regardless of educational background or place of\n        employment. Some courses have prerequisites included with the course description.\n        For these courses, participants are responsible for meeting the required prerequisites\n        or having the appropriate prior experience. Please note that our <a href=\"http://graduateschool.edu/index.php?option=com_content&amp;task=view&amp;id=188&amp;Itemid=200\">\n            leadership development programs</a> require <a href=\"http://graduateschool.edu/index.php?option=com_content&amp;task=view&amp;id=158\">\n                special application packages</a>. The Graduate School is an <a href=\"http://graduateschool.edu/index.php?option=com_content&amp;task=view&amp;id=362\">\n                    equal opportunity</a> provider and employer. We make every practical\n        effort to ensure that our programs are <a href=\"http://graduateschool.edu/index.php?option=com_content&amp;task=view&amp;id=146&amp;itemid=204\">\n            accessible</a> to physically challenged participants and participants with special\n        needs. We must receive your <a href=\"http://graduateschool.edu/index.php?option=com_content&amp;task=view&amp;id=385&amp;Itemid=174\">\n            payment or payment information</a> before we can process a registration application.\n        <strong>\n            <br>\n        </strong>\n        <br>\n        <br>\n        <strong><em>Credit Program Admissions:</em></strong><br>\n        The following admission requirements apply to the admission of students who intend\n        to enroll in courses for academic credit.</li>\n    <p>\n        Undergraduate students are required to be twenty-one (21) years of age or older\n        and meet at least <strong>one</strong> of the following admission standards:</p>\n    <ul>\n        <li>Earned a high school diploma with a grade point average (GPA) of 2.0 or above on\n            a 4.0 scale</li>\n        <li>Possess a General Equivalency Diploma (GED)</li>\n        <!--<li>Have matriculated at a post-secondary  institution and earned a grade of C or better in a college level course in  English and Mathematics</li>-->\n    </ul>\n    <p>\n        All applicants must submit an admission application with required non-refundable\n        application fee.</p>\n    <p>\n        <strong><em>Admission of Home-Schooled Students:</em></strong><br>\n        The Graduate School welcomes home-schooled students to apply for undergraduate admission.\n        Home-schooled applicants with an official GED must submit the following:</p>\n    <ul>\n        <li>Undergraduate application with required non-refundable application fee; </li>\n        <li>Official GED scores; and,</li>\n        <li>Official transcripts if the applicant has taken courses through a secondary or post-secondary\n            institution.</li>\n    </ul>\n    <p>\n        If a home-schooled student does not have an official GED score, then under the student\n        eligibility provisions of the Higher Education Opportunity Act the applicant must\n        provide verification of completion of high school, and may do so through:</p>\n    <ul>\n        <li>Home school transcripts with letter of completion;</li>\n        <li>Transcripts from regionally accredited home school program with certification of\n            completion and proof that the home school program is registered or recognized by\n            its own state department of education; or, </li>\n        <li>Written verification from appropriate school district that the student has met requirements\n            for a high school diploma in his/her home state.</li>\n    </ul>\n    <p>\n        Home-schooled students who earn diplomas through regionally accredited schools are\n        considered for admission under the School’s standard admissions policies based on\n        GPA.<br>\n    </p>\n</ol>",
              "categories": [
                {
                  "sys": {
                    "type": "Link",
                    "linkType": "Entry",
                    "id": "2m3flydlMQ0asAm4aOA8Y8"
                  }
                },
                {
                  "sys": {
                    "type": "Link",
                    "linkType": "Entry",
                    "id": "6RERYmqCXYy4iGI42Ky6Kc"
                  }
                },
                {
                  "sys": {
                    "type": "Link",
                    "linkType": "Entry",
                    "id": "4N01JUaq64qk2m8YMooc2Y"
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
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "5YnqnIhak86mCMgQOEaoQi",
              "revision": 5,
              "createdAt": "2015-10-30T14:03:23.885Z",
              "updatedAt": "2015-11-04T19:23:44.784Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "is-there-a-customer-satisfaction-guarantee-policy",
              "title": "Is there a customer satisfaction guarantee policy?",
              "question": "Is there a customer satisfaction guarantee policy?",
              "answer": "Yes, we have always guaranteed the quality of our courses and services and are proud that over two million participants have completed the courses we have conducted since 1921. Our courses and the other services we offer consistently receive high ratings for being well delivered, relevant and timely. If you are not satisfied that we have met the stated objectives of the course or services performed, just contact us to tell us why. We will either give you a refund or apply the amount toward the fee for another Graduate School course or service.",
              "categories": null,
              "cat2": null
            }
          },
          {
            "sys": {
              "space": {
                "sys": {
                  "type": "Link",
                  "linkType": "Space",
                  "id": "2v0dv55ahz7w"
                }
              },
              "type": "Entry",
              "contentType": {
                "sys": {
                  "type": "Link",
                  "linkType": "ContentType",
                  "id": "8c6nGKy83S6aQukwgkqgq"
                }
              },
              "id": "62sl899JoAiGywSQqWaIiE",
              "revision": 6,
              "createdAt": "2015-10-30T13:58:29.265Z",
              "updatedAt": "2015-11-04T19:23:43.443Z",
              "locale": "en-US"
            },
            "fields": {
              "slug": "how-do-i-request-a-transcript",
              "title": "How do I request a transcript?",
              "question": "How do I request a transcript?",
              "answer": "The Graduate School does not fax or email official transcript copies. Unofficial copies of transcripts may be emailed or faxed for $3.00 each. Official transcripts (affixed with the Graduate School Seal) are $5.00 each. Rush transcripts, processed in two business days are $15.00 each. All may be obtained by submitting a completed, signed transcript request form with payment to:&nbsp;\n    <p>\n        Office of the Registrar\n        <br>\n        Graduate School\n        <br>\n        600 Maryland Avenue, S.W., Suite 330\n        <br>\n        Washington, DC 20025-2520",
              "categories": null
            }
          }
        ]
      }
    });
  contentfulServerFaq;
  contentful.getFAQ(function(response) {
    expect(response.items[0].fields.title).to.exist;
  });
  t.end();
});
