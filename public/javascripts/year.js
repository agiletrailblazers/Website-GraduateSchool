$( document ).ready(function() {
    $.ajax(
        { type: "GET", url: '/year', context: this }
    ).done(function(data)
        {
            $('.copyright_year').text(data);
        }).fail(function()
        { throw new Error('timeAPI ajax called failed!'); }
    );
});