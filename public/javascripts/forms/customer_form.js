$(document).ready(function() {
  function getQueryString() {
    var result = {}, queryString = location.search.slice(1),
      re = /([^&=]+)=([^&]*)/g, m;
    while (m = re.exec(queryString)) {
      result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return result;
  }
  var formtype = getQueryString()["formtype"];
  if (formtype && typeof(formtype != 'undefined') && ("cfb".indexOf(formtype.toLowerCase().trim()) > -1) ) {

  } else {

  }

});
