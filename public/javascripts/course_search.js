var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);
    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
})();
searchField=urlParams["search"];
searchPageNum=urlParams["numRequested"];
selLocation=urlParams["cityState"];
    $("#itemsPerPage").change(function() {
       searchCriteria =$(this).val();
            location.href = "/course-search?search=" + searchField + "&numRequested=" + searchCriteria;
        //alert(searchPageNum);
   // });
        var selectedNum= $("#itemsPerPage").val();
        selectedNum=searchPageNum;
    });

$("#selLocation").change(function() {
    $.get( "/ajax-course-search", function() {
    }).done(function() {
        })

});
