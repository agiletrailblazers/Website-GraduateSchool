var express = require('express');
var router = express.Router();


// load all routes from sub-files
module.exports = function (app) {
    app.use('/', require('./routes/home-route'));
    app.use('/', require('./routes/course-route'));
    app.use('/', require('./routes/search-route'));
    app.use('/', require('./routes/whatsnew-route'));
    app.use('/', require('./routes/course-related-info-route'));
    app.use('/', require('./routes/news-route'));
    app.use('/', require('./routes/ajax-form-route'));
    app.use('/', require('./routes/form-route'));
    app.use('/', require('./routes/generic-page-route'));
    app.use('/', require('./routes/forms-route'));
    app.use('/', require('./routes/catalog-route'));
    app.use('/', require('./routes/faq-route'));
    app.use('/', require('./routes/subscription-route'));
    app.use(defaultUrlRedirect);
};

function defaultUrlRedirect(req, res, next) {
  require('../API/contentful.js').getContentUrlRedirect(function(data, error) {
    if (data != null) {
      var map = new Object();
      data.forEach(function (curr){
        map[curr.fields.from] = curr.fields.to;
      });

      if(require("../helpers/common.js").isNotEmpty(map[req.url])) {
        res.redirect(map[req.url]);
      }
      // redirect non-one word urls to pagenotfound. '1' is used in substring to ignore the first char in url i.e to ignore first '/'
      else if (-1 === req.url.substring(1).search(/^[A-Za-z0-9_-]+$/)){
        res.redirect('/pagenotfound');
      }
      // everything else redirects to page not found
      else {
        res.redirect('/');
      }
    } else {
        if (error) {
          require('../logger').error(error);
        }
    }
  });
}
