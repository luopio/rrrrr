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
  carousels = [];
  
  resizeHandler = function() {
    window_width = $(window).width();
    window_height = $(window).height();
  }
  
  initReuna = function() {
      $(window).keyup(keyUp);
      $('.carousel').ReunaCarousel();  
      setVimeoReadyEvents();
  }
  
  keyUp = function(e) {
      switch(e.keyCode) {
        case 38:
          prevSection();
          break;
        case 40:
          nextSection();
          break;
      }
    }
    prevSection = function() {
      var obj = $('.section.active').prev();
      if (obj.length !== 0) {
        $('.section.active').removeClass('active');
        obj.addClass('active');
        gotoSection(-1);
      }
    }
    nextSection = function() {
      var obj = $('.section.active').next();
      if (obj.length !== 0) {
        $('.section.active').removeClass('active');
        obj.addClass('active');
        gotoSection(1);
      }
    }
    gotoSection = function(i) {
      $('html,body').animate({scrollTop:$(window).height()*i,easing: 'easeInOutExpo'},300);
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
  jQuery.fn.ReunaCarousel = function() {
    var count = 0;
    return this.each(function() {
      var current = 0;
      var total = 0;
      var window_width = 0;
      var window_height = 0;
      var $this = $(this);
      $(window).load(function() { scaleImages(); });
  
      var init = function() {
        $(window).resize(resizeHandler);
        resizeHandler();
    
        total = $this.children('div').size();
        $(window).keyup(keyUp);
        count++;
      }
      var resizeHandler = function() {
        window_width = $(window).width();
        window_height = $(window).height();
    
        //$('.carousel').css({'height':window_height,'width':window_width});
        //$('html,body').animate({scrollTop:window_height*current_section},0);
        scaleImages();
        scaleVideos();
        positionDivs();
        positionContainer();
      }
  
      var scaleImages = function() {
        // Custom stuff based on jQuery Backstretch 1.2.4 http://srobbin.com/jquery-plugins/jquery-backstretch/
        $this.find('img').each(function(){
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
      var scaleVideos = function() {
        $this.find('iframe').each(function(){
          $(this).width( window_width ).height( window_height );
        });
      }
      var positionDivs = function() {
        var posx = 0;
        $this.children('div').each(function() {
          $(this).css({'position':'absolute','left':posx,'overflow':'hidden','width':window_width,'height':window_height});
           posx += window_width;
        });
        $this.css('width',posx);
      }
      var positionContainer = function() {
        $this.css({'top':count*window_height});
      }
      
      var previous = function() {
        if (current<=0) {return;}
        goTo(current-1);
      }
      var next = function() {
        if (current>=total-1) {return;}
        goTo(current+1);
      }
      var goTo = function(i) {
        current = i;
        $this.stop(true,true).animate({
          left: window_width*-i,
          easing: 'easeInOutExpo'}, 300, function() {
          });
      }
      var keyUp = function(e) {
        if (!$this.hasClass('active')) { return; }
          switch(e.keyCode) {
            case 37:
              previous();
              break;
            case 39:
              next();
              break;
          }
        }
      init();
    });
  }

	initReuna();
	$('#stuffpage').fadeOut(0);  
  $("#stuff").click(function(){ $('#stuffpage').delay(100).fadeIn(700); });
  $("#stuffpage").click(function(){ $('#stuffpage').delay(100).fadeOut(700); });
});