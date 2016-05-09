$(document).ready(function() {
    $(document).on("click", ".nav-tabs a", function (event) {
        var tab = $(this).attr("data-tab");
        $('#txtSelectedTab').val(tab);
        $("span[data-showfor~='" + tab + "']").removeClass('hidden');
        $("span[data-hidefor~='" + tab + "']").addClass('hidden');
        var selectedTab = $('#txtSelectedTab').val();
        history.pushState({state:1}, "", "?" + "tab=" + selectedTab);
    });

    var $height = 0 ;
    $("li.tab").each(function(){
        if(($(this).height())>$height){
            $height = $(this).height();
        }
    });
    $("li.tab").each(function(){
        $(this).css("height",$height)
    });

    $("#myReg").tablesorter();

});
