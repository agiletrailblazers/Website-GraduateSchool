$(document).ready(function() {
  var $height = 0 ;
  $("li.tab").each(function(){
    if(($(this).height())>$height){
            $height = $(this).height();
    }
  });
  $("li.tab").each(function(){
    $(this).css("height",$height)
  });

  $("#gtog0, #gtog1, #gtog2, #gtog3, #gtog4, #gtog5, #gtog6").tablesorter({
    // sort on the third column ie start date, and then on 2nd ie course code order asc
    sortList: [[2,0],[1,0]]
  });
});
