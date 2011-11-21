/* js trickery */

// introducing a reuna namespace to contain our util functions
var reuna = {};

$(function() {
  window_width = 0;
  window_height = 0;
  current_section = 0;
  total_sections = 0;
  carousels = [];
  
  resizeHandler = function() {
    window_width = $(window).width();
    window_height = $(window).height();
    $('.section').css({'height':window_height,'width':window_width});
    $('html,body').animate({scrollTop:window_height*current_section},0);
    scaleCarouselImages();
    placeCarouselText();
  }
  
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
  $('.carousel').cycle({
  		fx: 'fade'
  	});
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
  placeCarouselText = function() {
    $('.carousel').find('.carouseltext').each(function(){
      $(this).css('left', window_width-$(this).outerWidth());
      $(this).css('visibility','visible');
    });
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
var LINES = [];
var HEIGHT = 100.0;
var PREVUPDATE = 0;

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

        /* draw the circles for the background */
        for(i = 5; i > 0; i--) {
            var l = new Path();
            var p = new Point(view.center.x, //+ Math.random() * 500 - 250, 
                                view.center.y);  //+ Math.random() * 100 - 50);
            l._originalYs = [p.y];
            l._previousRoundYDelta = 0;
            l._previousRoundY = p.y;
            
            l.add(new Segment(
                new Point(view.bounds.bottomLeft.x, view.bounds.bottomLeft.y + 100),
                new Point(0, 200), 
                new Point(Math.random() * 100, Math.random() * -200)
                ));
            l.add(new Segment(p, 
                new Point(Math.random() * 100 - 200, Math.random() * 200), 
                new Point(Math.random() * 100 + 200, Math.random() * 200)
                ));
            l.add(new Segment(
                new Point(view.bounds.bottomRight.x, view.bounds.bottomLeft.y + 100),
                new Point(Math.random() * -100, Math.random() * -200),
                new Point(0, 200)
                ));
            
            l.closed = true;
//            l.fullySelected = true;
            l.strokeColor = null;
            l.fillColor = new RGBColor(0.15 * i % 2, 0.15 * i % 3, 0.15 * i % 4);
            l.strokeWidth = 5;
            LINES.push(l);
        }
        
        g1 = reuna.getLogoGroup(3.0, 
                       //new paper.RGBColor(0.3, 0.3, 0.3), 
                       //new paper.RGBColor(0.4, 0.4, 0.4), 
                       new paper.RGBColor(1.0, 1.0, 1.0), 
                       new paper.RGBColor(1.0, 1.0, 1.0), 
                       new Point(view.center.x, view.center.y),
                       new RGBColor(0.2, 0.2, 0.2));

        g1.opacity = 0.9;

        view.draw();

        tool.onMouseMove = function(event) {
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
            PREVUPDATE = event.time;
            
            for(li in LINES) {
                
                var s = event.time / 2.0;
                var r = 2 * Math.PI * (li / LINES.length);
                // var w = HEIGHT * Math.sin(f - Math.PI * 0.25);
                var sval = Math.sin(s + r);
                
                var currentY = view.size.height + LINES[li]._originalYs[0] * sval;
                var currentDelta = LINES[li]._previousRoundY - currentY;
                if(LINES[li]._previousRoundYDelta < 0 
                    && (currentDelta > 0 || currentDelta == 0)) 
                {
                    console.log('move ' + li)
                    project.activeLayer.insertChild(0, LINES[li]);
                }
                LINES[li]._previousRoundYDelta = currentDelta;
                LINES[li]._previousRoundY = currentY;
                LINES[li].segments[1].point.y = currentY;
                                    
                //LINES[li].segments[0].point.x = -w - HEIGHT;
                //LINES[li].segments[2].point.x = view.size.width + w + HEIGHT;
                
                //LINES[li].segments[0].point.y = h;
                //LINES[li].segments[2].point.y = h;

                
            }
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
        rtop.strokeWidth = 8;
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
        rbottom.strokeWidth = 8;
    } else {
        rbottom.strokeColor = null;
    }
    rbottom.fillColor = fColor; 
    return rbottom;
}
