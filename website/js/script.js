/* js trickery */

$(function() {
  window_width = 0;
  window_height = 0;
  current_section = 0;
  
  resizeHandler = function() {
    window_width = $(window).width();
    window_height = $(window).height();
    $('.section').css({'height':window_height,'width':window_width});
    $('html,body').animate({scrollTop:window_height*current_section},0);
  }
  
  init = function() {
      $(window).resize(resizeHandler);
      resizeHandler();
      $('ul#nav').find('li').each(function(k,v){
        $(this).click(function(){
          current_section = k;
          $('html,body').animate({scrollTop:window_height*k},'slow');
        });
      });
  }
  init();
});



/* paperjs stuff below */













