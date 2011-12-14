// TODO:
// Make carousel more OOP (one class)
// Add menu items
// Add landing page
// Add contact page
// Fix carousel central positioning to take into account stationary left bar.
// Make visual arrow buttons active
// Find new formulas for easing


// introducing a reuna namespace to contain our util functions
var reuna = {};

$(document).ready(function() {
  window_width = 0;
  window_height = 0;
  window_width = 0;
  current_section = 0;
  total_sections = 0;
  current_carousel = [];
  total_carousels = [];
  
  resizeHandler = function() {
    window_width = $(window).width();
    window_height = $(window).height();
    $('.section').css({'height':window_height,'width':window_width});
    $('html,body').animate({scrollTop:window_height*current_section},0);
    scaleCarouselImages();
    scaleCarouselVideos();
    placeCarouselDivs();
  }
  
  $('#info').click(function() {
		$('.carouseltext').delay(50).animate({width:'toggle'}, 300);
	});
  
  $(window).load(function() { scaleCarouselImages(); });
  
  init = function() {
      $(window).resize(resizeHandler);
      resizeHandler();
      $('ul#nav').find('li').each(function(k,v){
              total_sections++;
              $(this).click(function(){
                //current_section = k;
                //$('html,body').animate({scrollTop:window_height*k},'slow');
                gotoSection(k);
              });
            });
            $(window).keyup(keyDown);
            /*
            $('.carousel').cycle({
            		fx: 'fade',
            		timeout:10000,
            	});*/
      $('.carousel').each(function(k,v) {
        current_carousel[k] = 0;
        total_carousels[k] = 0;
        $(this).find('>div').each(function(){total_carousels[k]+=1;});
      });
      setVimeoReadyEvents();
  }
  
  keyDown = function(e) {
      switch(e.keyCode) {
        case 37:
          //prev carousel
          prevCarousel();
          break;
        case 39:
          //next carousel
          nextCarousel();
          break;
        case 38:
          prevSection();
          break;
        case 40:
          nextSection();
          break;
      }
    }
    prevCarousel = function() {
      if (current_carousel[current_section]<=0) {return;}
      gotoCarousel(current_carousel[current_section]-1);
    }
    nextCarousel = function() {
      if (current_carousel[current_section]>=total_carousels[current_section]-1) {return;}
      gotoCarousel(current_carousel[current_section]+1);
    }
    gotoCarousel = function(i) {
      current_carousel[current_section] = i;
      $('.carousel').stop(true,true).animate({
          left: window_width*-i,
          easing: 'easeOutExpo'}, 300, function() {
          });
    }

    prevSection = function() {
      if (current_section<=0) {return;}
      gotoSection(current_section-1);
    }
    nextSection = function() {
      if (current_section>=total_sections) {return;}
      gotoSection(current_section+1);
    }
    gotoSection = function(i) {
      if (i>=total_sections) {return;}
      current_section=i;
      $('html,body').animate({scrollTop:window_height*i},'slow');
    }
  
  scaleCarouselImages = function() {
    /* Custom stuff based on jQuery Backstretch 1.2.4 http://srobbin.com/jquery-plugins/jquery-backstretch/ */
    $('.carousel').find('img').each(function(){
      var self = $(this), imgWidth, imgHeight;
      rootElement = ("onorientationchange" in window) ? $(document) : $(window);
      var rootWidth = rootElement.width();
      var rootHeight = rootElement.height();
      //rootWidth -= 200;
      self.css({width: "auto", height: "auto"});
      imgWidth = this.width;
      imgHeight = this.height;
      imgRatio = imgWidth / imgHeight;
    
      bgCSS = {left: 0, top: 0};
      bgWidth = rootWidth;
      bgHeight = bgWidth / imgRatio;
      $(this).css({position: "absolute"});
    
      // Make adjustments based on image ratio
      // Note: Offset code provided by Peter Baker (http://ptrbkr.com/). Thanks, Peter!
      if(bgHeight >= rootHeight) {
          bgOffset = (bgHeight - rootHeight) /2;
          $.extend(bgCSS, {top: "-" + bgOffset + "px"});
      } else {
          bgHeight = rootHeight;
          bgWidth = bgHeight * imgRatio;
          bgOffset = (bgWidth - rootWidth) / 2;
          $.extend(bgCSS, {left: "-" + bgOffset + "px"});
      }
      $.extend(bgCSS, {visibility: 'visible'});
      $(this).width( bgWidth ).height( bgHeight ).filter("img").css(bgCSS);
      });
  }
  scaleCarouselVideos = function() {
    $('.carousel').find('iframe').each(function(){
      $(this).width( window_width ).height( window_height );
    });
  }
  placeCarouselText = function() {
    $('.carousel').find('.contenutext').each(function(){
      $(this).css('width', window_width);
      $(this).css('visibility','visible');
    });
  }
  placeCarouselDivs = function() {
    var posx = 0;
    $('.carousel > div').each(function() {
      $(this).css({'position':'absolute','left':posx,'overflow':'hidden','width':window_width,'height':window_height});
       posx += window_width;
    });
    $('.carousel').css('width',posx);
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
  /*
  Carousel = function() {
    this.current = 0;
    this.total = 0;
    this.previous = function() {
      
    }
    this.next = function() {
      
    }
    this.goto = function() {
      
    }
  }
  */

	init();
	//$('#nav').animate({width:'hide'}, 0);
	$('#stuffpage').fadeOut(0);
  //$('#topleftlogo').hover(function(){ $('#nav').stop(true,true).animate({height:'show'}, 200); },function(){  $('#nav').stop(true,true).animate({height:'hide'}, 200); });
  
  $("#stuff").click(function(){ $('#stuffpage').delay(100).fadeIn(700); });
  $("#stuffpage").click(function(){ $('#stuffpage').delay(100).fadeOut(700); });
});