/* js trickery */

// introducing a reuna namespace to contain our util functions
var reuna = {};

$(function() {
  window_width = 0;
  window_height = 0;
  current_section = 0;
  total_sections = 0;
  carousels = [];
  
  $('.carouseltext').animate({width:'hide'}, 0); // Hide in the beginning
  
  resizeHandler = function() {
    window_width = $(window).width();
    window_height = $(window).height();
    $('.section').css({'height':window_height,'width':window_width});
    $('html,body').animate({scrollTop:window_height*current_section},0);
    scaleCarouselImages();
    scaleCarouselVideos();
    //placeCarouselText();
  }
  
  $('#info').click(function() {
		$('.carouseltext').delay(50).animate({width:'toggle'}, 300);
		//$('#info').css("background", 'black').css("color",'white');
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
          gotoView(k);
        });
      });
      $(window).keyup(keyDown);
      $('.carousel').cycle({
      		fx: 'fade',
      		timeout:10000,
      		
      	});
      setVimeoReadyEvents();
  }
  
  keyDown = function(e) {
    switch(e.keyCode) {
      case 37:
        break;
      case 39:
        break;
      case 38:
        prevView();
        break;
      case 40:
        nextView();
        break;
    }
  }
  
  nextView = function() {
    if (current_section>=total_sections) {return;}
    gotoView(current_section+1);
  }
  
  prevView = function() {
    if (current_section<=0) {return;}
    gotoView(current_section-1);
  }
  
  gotoView = function(i) {
    if (i>=total_sections) {return;}
    current_section=i;
    $('html,body').animate({scrollTop:window_height*i},'slow');
  }
  
  scaleCarouselImages = function() {
    /* Custom stuff based on jQuery Backstretch 1.2.4 http://srobbin.com/jquery-plugins/jquery-backstretch/ */
    $('.carousel').find('img').each(function(){
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
    $('.carousel').find('iframe').each(function(){
      $(this).width( window_width ).height( window_height );
    });
  }
  placeCarouselText = function() {
    $('.carousel').find('.carouseltext').each(function(){
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
    froogaloop.addEvent('play', function(data) { $('#'+data.replace('vimeo_', '')+'.carousel').cycle('pause'); });
    froogaloop.addEvent('finish', function(data) { $('.carousel').cycle('resume'); });
    //froogaloop.addEvent('pause', function(data) { $('.carousel').cycle('resume'); });
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
  
  paper.install(window);
    
    // Because there is no activate function implemented for
    // paperscopes. Init one scope, then do stuff. Then init other.
    // PaperScope.activate() will be implemented later though
    // to switch between scopes. Before it is implemented we
    // have to do stuff respectively
    // http://groups.google.com/group/paperjs/msg/e5b4a1c0fff9d49e
    //
    // I also put draw stuff for each canvas into a function so,
    // it is clean in this main document.ready
    //
    // First initCanvas(), then end with endCanvas()
    // It is also necessary to put some stuff inside with(paper){ } .
    
    reuna.initCanvas('reunacanvas');
    reuna.drawReunaCanvas();
    reuna.endCanvas();
    
    reuna.initCanvas('colortvcanvas');
    reuna.endCanvas();
  
});

/* paperjs stuff below */
var SPEEDFACTOR = 1.9;
var YSPEED = 0;
var XSPEED = 0;

reuna.initCanvas = function(canvasName) {
    var newPaper = new paper.PaperScope(); 
    newPaper.setup(canvasName);
}

reuna.endCanvas = function() {
    paper.view.draw();
}

reuna.drawReunaCanvas = function() {
    with(paper) {
        var tool = new Tool();
        
        // draw the mounds
        g1 = reuna.getLogoGroup(2.0, 
                       //new paper.RGBColor(0.3, 0.3, 0.3), 
                       //new paper.RGBColor(0.4, 0.4, 0.4), 
                       new paper.RGBColor(0.2, 0.3, 0.3), 
                       new paper.RGBColor(0.3, 0.2, 0.2), 
                       new Point(view.center.x, view.center.y / 3 * 2),
                       new paper.RGBColor(1.0, 1.0, 1.0));

        g1.opacity = 0.9;

        view.draw();

        tool.onMouseMove = function(event) {
            // SPEEDFACTOR = 0.8 + (event.point.y / view.bounds.height / 2);
        }
      
        view.onResize = function(event) {
            g1.position.x = view.center.x;
            g1.position.y = view.center.y;
            view.draw();
        }
        
        // setTimeout(function() { update(); }, 200);
        
        view.onFrame = update;
    }
}

function update(event) {
    with (paper) {
        if(event.time - PREVUPDATE > 0.1) {
            if(YSPEED > 0) {
                YSPEED -= 0.5;
            }
            if(XSPEED > 0) {
                XSPEED -= 0.5;
            }
            PREVUPDATE = event.time;
            view.draw();
        }
    }
}

reuna.getLogoGroup = function(scale, color1, color2, pos, strokeColor) {
    var Rtop = reuna.drawLogoTop(color1, strokeColor);
    var Rbottom = reuna.drawLogoBottom(color2, strokeColor);
    var g = new paper.Group();
    g.addChild(Rtop);
    g.addChild(Rbottom);
    g.scale(scale);
    g.translate(pos);
    return g;
}

reuna.drawLogoTop = function(fColor, sColor) {
    var rtop = new Path();
    rtop.add(new Point(-30, -40));  
    rtop.add(new Segment(new Point(-2.5, -40), null, new Point(17.5, 0)));
    rtop.add(new Segment(new Point(30, -12.5), new Point(0, -17.5), new Point(0, 17.5)));
    rtop.add(new Segment(new Point(-2.5, 15), new Point(17.5, 0), null));
    rtop.add(new Point(-30, 15));
    rtop.closed = true;
    if(sColor) {
        rtop.strokeColor = sColor;
        rtop.strokeWidth = 4;
    } else {
        rtop.strokeColor = null;
    }
    rtop.fillColor = fColor;
    return rtop;
}

reuna.drawLogoBottom = function(fColor, sColor) {
    var rbottom = new Path();
    rbottom.add(new Point(-30, -20));
    rbottom.add(new Point(30, 40));
    rbottom.add(new Point(-30, 40));
    rbottom.closed = true;
    if(sColor) {
        rbottom.strokeColor = sColor;
        rbottom.strokeWidth = 4;
    } else {
        rbottom.strokeColor = null;
    }
    rbottom.fillColor = fColor; 
    return rbottom;
}
