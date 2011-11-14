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
  }
  
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
    
      $(this).width( bgWidth ).height( bgHeight ).filter("img").css(bgCSS);
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
var circles = [];
var circleData = { centerX: 0, // Math.random() * 100 + 100,
                    centerY: Math.random() * 100 + 200,
                    hilightIndex: 0,
                    greenSpeed: 0.01,
                    redSpeed: 0.02,
                    blueSpeed: -0.01,
                    strokeSpeed: 0.8,
                    curRed: 0.0,
                    curBlue: 0.0,
                    curGreen: 0.0,
                    curStroke: 1.0,
                    backgroundBox: null,
                    };


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

        // learnt lessons:
        // - clipping only seems to work with paths. cant have 
        //   group inside the clipping area
        // - joining does not produce true, flat forms, simplify just messes up with curves
        // - while clipping elements, the top element (mask) defines the color 
        //   for the underlying elems, which sucks badly

        circleData.backgroundBox = Path.Rectangle(new Point(0, 0), 
                                        new Point(view.bounds.width, view.bounds.height));
        circleData.backgroundBox.fillColor = 'white';
        circleData.curRed = 2.9;
        circleData.curGreen = 2.9;
        circleData.curBlue = 2.9;

        /* draw the circles for the background */
        for(i = 10; i > 0; i--) {
            var c = new Path.Circle(new Point(circleData.centerX, circleData.centerY), 
                                        i * i * i * i / 10.2);
            c.fillColor = new paper.RGBColor();
            c.strokeColor = new paper.RGBColor(1.0, 1.0, 1.0, 0.2);
            circles.push(c);
        }
        for(i = 0; i < circles.length; i++) {
            circles[i].fillColor.red    = circleData.curRed / (i + 1);
            circles[i].fillColor.green  = circleData.curGreen / (i + 1);
            circles[i].fillColor.blue   = circleData.curBlue / (i + 1);
            circles[i].strokeWidth = circleData.curStroke;
        }
       
        g5 = reuna.getLogoGroup(3.1, 
                       new paper.RGBColor(1.0, 1.0, 1.0), 
                       new paper.RGBColor(1.0, 1.0, 1.0), 
                       new Point(view.center.x, view.center.y));
        g4 = reuna.getLogoGroup(3.1, 
                       new paper.RGBColor(1.0, 1.0, 1.0), 
                       new paper.RGBColor(1.0, 1.0, 1.0), 
                       new Point(view.center.x, view.center.y));
        g1 = reuna.getLogoGroup(3.0, 
                       //new paper.RGBColor(0.3, 0.3, 0.3), 
                       //new paper.RGBColor(0.4, 0.4, 0.4), 
                       new paper.RGBColor(1.0, 1.0, 1.0), 
                       new paper.RGBColor(1.0, 1.0, 1.0), 
                       new Point(view.center.x, view.center.y),
                       new RGBColor(0.2, 0.2, 0.2));

        g1.opacity = 0.9;
        g4.opacity = 0.18;
        g5.opacity = 0.1;

        view.draw();

        tool.onMouseMove = function(event) {
           g4.position.x = view.center.x + (view.center.x - event.point.x) / 8.0;
           g4.position.y = view.center.y + (view.center.y - event.point.y) / 8.0;
           g5.position.x = view.center.x + (view.center.x - event.point.x) / 12.0;
           g5.position.y = view.center.y + (view.center.y - event.point.y) / 12.0;
        }
      
        view.onResize = function(event) {
            g1.position.x = view.center.x;
            g1.position.y = view.center.y;
            g4.position.x = view.center.x + (view.center.x - event.point.x) / 8.0;
            g4.position.y = view.center.y + (view.center.y - event.point.y) / 8.0;
            g5.position.x = view.center.x + (view.center.x - event.point.x) / 12.0;
            g5.position.y = view.center.y + (view.center.y - event.point.y) / 12.0;    
            // yeay! yet another logic to draw rectangles: counter-clockwise 
            // starting from bottom left. thanks paperjs devs..
            circleData.backgroundBox.segments[0].point.y = view.bounds.height;
            circleData.backgroundBox.segments[2].point.x = view.bounds.width;
            circleData.backgroundBox.segments[3].point.x = view.bounds.width;
            circleData.backgroundBox.segments[3].point.y = view.bounds.height;

            view.draw();
       }

       setTimeout(function() { update(); }, 200);
    }
}

function update() {
    with (paper) {
      var randSpeedX = Math.random() * 3 - 1.5;
      var randSpeedY = Math.random() * 3 - 1.5;
    
      if(circleData.curRed >= 1.5 && circleData.redSpeed > 0) {
          circleData.redSpeed = circleData.redSpeed * -1;
      } else if(circleData.curRed <= 0.2 && circleData.redSpeed < 0) {
          circleData.redSpeed = circleData.redSpeed * -1;
      }
      if(circleData.curBlue >= 1.5 && circleData.blueSpeed > 0) {
          circleData.blueSpeed = circleData.blueSpeed * -1;
      } else if(circleData.curBlue <= 0.2 && circleData.blueSpeed < 0) {
          circleData.blueSpeed = circleData.blueSpeed * -1;
      }
      if(circleData.curGreen >= 1.5 && circleData.greenSpeed > 0) {
          circleData.greenSpeed = circleData.greenSpeed * -1;
      } else if(circleData.curGreen <= 0.2 && circleData.greenSpeed < 0) {
          circleData.greenSpeed = circleData.greenSpeed * -1;
      }
      if(circleData.curStroke >= 64.0 && circleData.strokeSpeed > 0) {
          circleData.strokeSpeed = circleData.strokeSpeed * -1;
      } else if(circleData.curStroke <= 0.9 && circleData.strokeSpeed < 0) {
          circleData.strokeSpeed = circleData.strokeSpeed * -1;
      }
      
      circleData.curRed     += circleData.redSpeed;
      circleData.curGreen   += circleData.greenSpeed;
      circleData.curBlue    += circleData.blueSpeed;
      circleData.curStroke  += circleData.strokeSpeed;
      
      for(i = 0; i < circles.length; i++) {
          circles[i].fillColor.red    = circleData.curRed / (i + 1);
          circles[i].fillColor.green  = circleData.curGreen / (i + 1);
          circles[i].fillColor.blue   = circleData.curBlue / (i + 1);
          circles[i].strokeWidth      = circleData.curStroke / (i * i + 1);
          //circles[i].position.x += randSpeedX;
          //circles[i].position.y += randSpeedY;
      }
      /*circleData.hilightIndex++;
      if(circleData.hilightIndex > 100) {
          circleData.hilightIndex = 0;
      }*/
      view.draw();
      setTimeout(function() { update(); }, 200);
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
