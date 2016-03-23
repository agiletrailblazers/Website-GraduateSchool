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
}
