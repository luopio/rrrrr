// introducing a reuna namespace to contain our util functions
var reuna = {};

$(document).ready(function() {
  window_width = 0;
  window_height = 0;
  window_width = 0;
  current_section = 0;
  sections = [];
  total_sections = 0;
  current_carousel = [];
  total_carousels = [];
  carousels = [];
  vimeo_players = [];
  
  resizeHandler = function() {
    window_width = $(window).innerWidth();
    window_height = $(window).innerHeight();
    var w = $('#nav-dots').width();
    $('#nav-dots').css({'top':window_height-80,'right':20});
  }
  
  initReuna = function() {
    $(window).bind('scroll', scrollHandler);
    $(window).keyup(keyUp);
    $(window).keydown(keyDown);
    echo("scrollhnad" + scrollHandler)
    $('.carousel').ReunaCarousel();
    setVimeoReadyEvents();
    
    $(window).resize(resizeHandler);
    resizeHandler();
    
    $('#pagePrev').click(function(){$('.section.active').trigger('previous');pauseVimeoVideos();});
    $('#pageNext').click(function(){$('.section.active').trigger('next');pauseVimeoVideos();});
    $('#pageUp').click(prevSection);
    $('#pageDown').click(nextSection);
    $('#nav').find('li').each(function(k,v) {
        $(this).click(function(e){
            e.preventDefault();
            gotoNamedSection($(this).find('a').attr("href"));
        });
    });
    $.scrollTo({top:0,left:0},0);
    //$.scrollTo({top:0,left:0},1000);
    
  }
  
  keyUp = function(e) {
    echo("keyup")
    e.preventDefault();
      switch(e.keyCode) {
        case 38:
          prevSection();
          break;
        case 40:
          nextSection();
          break;
      }
    return false;
  }

  keyDown = function(e) {
    echo("keydown")
    switch(e.keyCode) {
      case 37:
      case 38:
      case 39:
      case 40:
      e.preventDefault();
      pauseVimeoVideos()
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
  gotoNamedSection = function(target_id) {
      pauseVimeoVideos();
      var obj = $('#container').find(target_id);
      $('.section.active').removeClass('active');
      obj.addClass('active');
      if (obj.length !== 0) {
          $.scrollTo({top:obj.css('top'), left:0}, 400, {easing:'easeInOutExpo'});
          window.setTimeout(function() {
              $('.section.active').trigger('first');
      }, 300);
      }
  }
  gotoSection = function(i) {
    pauseVimeoVideos();
    var top_pos = '+='+String(window_height*i)+'px';
    $.scrollTo({ top:top_pos, left:0}, 400, {easing:'easeInOutExpo'});
    window.setTimeout(function() {  
        $('.section.active').trigger('first');
    }, 300);
    //$('html,body').animate({scrollTop:$(window).height()*i,easing: 'easeInOutExpo'},1000);
  }
  pauseVimeoVideos = function() {
      $.each(vimeo_players, function(k, v) {
          v.api('pause');
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
    vimeo_players.push(froogaloop);
    //froogaloop.addEvent('play', function(data) { $('#'+data.replace('vimeo_', '')+'.carousel').cycle('pause'); });
    //froogaloop.addEvent('finish', function(data) { $('.carousel').cycle('resume'); });
   }
  
  addEvent = function (element, eventName, callback) {
    if (element.addEventListener) {
      element.addEventListener(eventName, callback, false);
    }
    else {
      element.attachEvent(eventName, callback, false);
    }
  }
  
  scrollHandler = function(e) {
    console.log(e)
    echo("scroll event! " + e.detail)
  }
  
  jQuery.fn.ReunaCarousel = function() {
    var count = 0;
    return this.each(function() {
      var current = 0;
      var total = 0;
      var window_width = 0;
      var window_height = 0;
      var $this = $(this);
      var left_offset = 240;
      var this_count = count;
      var animation_speed = 500;
      var animating = false;
      $(window).load(function() { scaleImages(); });
  
      var init = function() {
        $(window).resize(resizeHandler);
        resizeHandler();
    
        total = $this.children('div').size();
        $this.bind('First Slide', first);
        $this.bind('Previous Slide', previous);
        $this.bind('Next Slide', next);
        $(window).keyup(keyUp);
        count++;
      }
      var resizeHandler = function() {
        window_width = $(window).innerWidth();
        window_height = $(window).innerHeight();
    
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
          if ($(this).hasClass('original')) { return true;}
          var self = $(this), imgWidth, imgHeight;
          rootElement = ("onorientationchange" in window) ? $(document) : $(window);
          var rootWidth = rootElement.innerWidth();
          var rootHeight = rootElement.innerHeight();
          rootWidth -= left_offset;
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
          $(this).width( window_width-left_offset ).height( window_height );
        });
      }
      var positionDivs = function() {
        var posx = 0;
        $this.children('div').each(function(k,v) {
          $(this).css({'position':'absolute','left':posx,'overflow':'hidden','width':window_width,'height':window_height});
           posx += window_width-left_offset;
        });
        $this.css('width',posx);
      }
      var positionContainer = function() {
        $this.css({'top':this_count*window_height,'left':left_offset});
      }
      var refreshNavDots = function() {
          $('#nav-dots').html('');
          if (total == 1) return;
          
          $this.children('div').each(function(k,v) {
              var def = 'rest';
              if (k == current) {
                  def = 'current';
              }
              var $dot = $('<li class="'+def+'"></li>');
              $('#nav-dots').append($dot);
              $dot.click(function(){goTo(k);});
          });
      }
      
      var first = function() {
        goTo(0);
      }
      
      var previous = function() {
        if (current<=0) {return;}
        goTo(current-1);
      }
      var next = function() {
        if (current>=total-1) { goTo(0,true); return;}
        goTo(current+1);
      }
      var goTo = function(i,speed) {
        current = i;
        animating = true;
        spd = speed ? animation_speed*2 : animation_speed;
        $this.stop(true,true).animate(
          {left: ((window_width-left_offset)*-i)+left_offset},
          spd, 'easeInOutExpo', function() {
            animating = false;
          });
          refreshNavDots();
      }
      var keyUp = function(e) {
        e.preventDefault();
        if (!$this.hasClass('active')) { return; }
        if (animating) { return; }
          switch(e.keyCode) {
            case 37:
              previous();
              break;
            case 39:
              next();
              break;
          }
          return false;
        }
      this.previous = previous;
      this.next = next;
      this.first = first;
      init();
    });
  }

    initReuna();
    $('#stuffpage').fadeOut(0);  
  $("#stuff").click(function(){ $('#stuffpage').delay(100).fadeIn(700); });
  $("#stuffpage").click(function(){ $('#stuffpage').delay(100).fadeOut(700); });
});
