// introducing a reuna namespace to contain our util functions
var reuna = {};

$(function() {
  window_width = 0;
  window_height = 0;
  
  resizeHandler = function() {
    window_width = $(window).width();
    window_height = $(window).height();
    $('#content div').css({'height':window_height,'width':window_width});
    //$('html,body').animate({scrollTop:window_height*current_section},0);
    scaleCarouselImages();
    scaleCarouselVideos();
  }
  
  $('#info').click(function() {
		$('.contenutext').delay(50).animate({width:'toggle'}, 300);
	});
  
  $(window).load(function() { scaleCarouselImages(); });
  
  init = function() {
      $(window).resize(resizeHandler);
      resizeHandler();
      setVimeoReadyEvents();
  }
  
  scaleCarouselImages = function() {
    /* Custom stuff based on jQuery Backstretch 1.2.4 http://srobbin.com/jquery-plugins/jquery-backstretch/ */
    $('.scalefit').find('img').each(function(){
      var self = $(this), imgWidth, imgHeight;
      rootElement = ("onorientationchange" in window) ? $(document) : $(window);
      self.css({width: "auto", height: "auto"});
      imgWidth = this.width;
      imgHeight = this.height;
      imgRatio = imgWidth / imgHeight;
    
      bgCSS = {left: 0, top: 0}
      bgWidth = rootElement.width();
      bgHeight = bgWidth / imgRatio;
    
      // Make adjustments based on image ratio
      // Note: Offset code provided by Peter Baker (http://ptrbkr.com/). Thanks, Peter!
      if(bgHeight >= rootElement.height()) {
          bgOffset = (bgHeight - rootElement.height()) /2;
          $.extend(bgCSS, {top: "-" + bgOffset + "px"});
      } else {
          bgHeight = rootElement.height();
          bgWidth = bgHeight * imgRatio;
          bgOffset = (bgWidth - rootElement.width()) / 2;
          $.extend(bgCSS, {left: "-" + bgOffset + "px"});
      }
      $.extend(bgCSS, {visibility: 'visible'});
      $(this).width( bgWidth ).height( bgHeight ).filter("img").css(bgCSS);
      });
  }
  scaleCarouselVideos = function() {
    $('.contenu').find('iframe').each(function(){
      $(this).width( window_width ).height( window_height );
    });
  }
  placeCarouselText = function() {
    $('.contenu').find('.contenutext').each(function(){
      $(this).css('width', window_width);
      $(this).css('visibility','visible');
    });
  }
  setVimeoReadyEvents = function() {
    var vimeoPlayers = document.querySelectorAll('iframe'), player;
    for (var i = 0, length = vimeoPlayers.length; i < length; i++) {
      player = vimeoPlayers[i];
      $f(player).addEvent('ready', vimeoReady);
    }
  }
  setVimeoEvent = function() {
  }
  vimeoReady = function(player_id) {
    var froogaloop = $f(player_id);
    froogaloop.addEvent('play', function(data) { $('#'+data.replace('vimeo_', '')+'.contenu').cycle('pause'); });
    froogaloop.addEvent('finish', function(data) { $('.contenu').cycle('resume'); });
    //froogaloop.addEvent('pause', function(data) { $('.contenu').cycle('resume'); });
  }
  
  addEvent = function (element, eventName, callback) {
    if (element.addEventListener) {
      element.addEventListener(eventName, callback, false);
    }
    else {
      element.attachEvent(eventName, callback, false);
    }
  }

	init();
});

$(document).ready(function() {
  //ascensor
  $('#content').ascensor({
	  AscensorName:'page',
	  WindowsFocus:true,
	  WindowsOn:1,
	
	  NavigationDirection:'xy',
	  Direction:'y',
	  Navig:true,
	  Link:true,
	  ReturnURL:true,
	  PrevNext:false,
	  CSSstyles:false,
	
	  KeyArrow:true,
	  keySwitch:false,
	  ReturnCode:false,
	
	  ChocolateAscensor:true,
	  AscensorMap:'5|3',
	  ContentCoord:'1|1 & 2|1 & 3|1 & 3|2 & 3|3 & 4|1 & 4|2 & 4|3 & 5|1 & 5|2'
  });

  $(document).keydown(function(e){
    switch(e.keyCode){
      case 37: //leftkey
        $("#pagePrev").trigger("click");
      break;
      case 39: //rightkey
        $("#pageNext").trigger("click");
      break;
      case 38: //up
        $("#page_Up").trigger("click");
      break;
      case 40: //down
        $("#page_Down").trigger("click");
      break;
    }
  });
  
  // hide in the beginnning
	$('#nav').animate({width:'hide'}, 0);
	$('#stuffpage').fadeOut(0);
  
  // show/hide navigation
  $("#logo").mouseenter(function(){ $('#nav').stop().animate({height:'show'}, 300); }); // show when entering menu
  $("#nav").mouseenter(function(){ $('#nav').stop().animate({height:'show'}, 300); }); // show when entering menu
	$("#nav, #logo").mouseleave(function(){ $('#nav').stop().animate({height:'hide'}, 300); }); // hide when leaving menu
  
  $("#stuff").click(function(){ $('#stuffpage').delay(100).fadeIn(700); });
  $("#stuffpage").click(function(){ $('#stuffpage').delay(100).fadeOut(700); });
  
});
  
