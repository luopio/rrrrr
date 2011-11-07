/* js trickery */

$(function() {
  window_width = 0;
  window_height = 0;
  current_section = 0;
  total_sections = 0;
  
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
  
  init();
  
});

/* paperjs stuff below */
var circles = [];
var circleData = { centerX: Math.random() * 100 + 100,
                    centerY: Math.random() * 100 + 100,
                    hilightIndex: 0,
                    greenSpeed: 0.01,
                    redSpeed: 0.01,
                    blueSpeed: 0.01
                    };


$(function() {
    paper.install(window);
    
    // Becuase there is no activate function implemented for
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
    //
    
    initCanvas('reunacanvas');
    drawReunaCanvas();
    endCanvas();
    
    initCanvas('colortvcanvas');
    endCanvas();
});

// Generic Functions
initCanvas = function(canvasName) {
  var newPaper = new paper.PaperScope(); 
  newPaper.setup(canvasName);
}
endCanvas = function() {
  paper.view.draw();
}

// Draw Reuna Canvas
drawReunaCanvas = function() {
    with(paper) {
      var tool = new Tool();

       // learnt lessons:
       // - clipping only seems to work with paths. cant have 
       //   group inside the clipping area
       // - joining does not produce true, flat forms, simplify just messes up with curves
       // - while clipping elements, the top element (mask) defines the color 
       //   for the underlying elems, which sucks badly

       for(i = 0; i < 50; i++) {
           var c = new Path.Circle(new Point(circleData.centerX, circleData.centerY), 
                                       1050 - 20 * i * i / 50);
           c.fillColor = new paper.RGBColor(0.4, 1 - 0.02 * i, 0.8 - i * 0.01);
           c.strokeColor = 'black';
           circles.push(c);
       }

       g5 = getReunaLogoGroup(2.8, 
                       new paper.RGBColor(0.3, 0.3, 0.3), 
                       new paper.RGBColor(0.4, 0.4, 0.4), 
                       new Point(view.center.x, view.center.y));
       g4 = getReunaLogoGroup(2.8, 
                       new paper.RGBColor(0.3, 0.3, 0.3), 
                       new paper.RGBColor(0.4, 0.4, 0.4), 
                       new Point(view.center.x, view.center.y));
       g1 = getReunaLogoGroup(3.0, 
                       new paper.RGBColor(0.3, 0.3, 0.3), 
                       new paper.RGBColor(0.4, 0.4, 0.4), 
                       new Point(view.center.x, view.center.y));

       g1.opacity = 0.5;
       g4.opacity = 0.2;
       g5.opacity = 0.1;

       view.draw();

       tool.onMouseMove = function(event) {
           g4.position.x = view.center.x + (view.center.x - event.point.x) / 7.0;
           g4.position.y = view.center.y + (view.center.y - event.point.y) / 10.0;
           g5.position.x = view.center.x + (view.center.x - event.point.x) / 12.0;
           g5.position.y = view.center.y + (view.center.y - event.point.y) / 18.0;

       }

       setTimeout(function() { shiverLoop(); }, 200);
    }
}

function shiverLoop() {
    
    var randSpeedX = Math.random() * 3 - 1.5;
    var randSpeedY = Math.random() * 3 - 1.5;
    
    if(circles[0].fillColor.red >= 0.8) {
        circleData.redSpeed = -0.001;
    } else if(circles[0].fillColor.red <= 0.2) {
        circleData.redSpeed = 0.001;
    }
    if(circles[0].fillColor.blue >= 0.8) {
        circleData.blueSpeed = -0.001;
    } else if(circles[0].fillColor.blue <= 0.2) {
        circleData.blueSpeed = 0.001;
    }
    if(circles[0].fillColor.green >= 0.8) {
        circleData.greenSpeed = -0.001;
    } else if(circles[0].fillColor.green <= 0.2) {
        circleData.greenSpeed = 0.001;
    }
        
    for(i = 0; i < circles.length; i++) {
        circles[i].fillColor.red += circleData.redSpeed;
        circles[i].fillColor.green += circleData.greenSpeed;
        circles[i].fillColor.blue += circleData.blueSpeed;
        //circles[i].position.x += randSpeedX;
        //circles[i].position.y += randSpeedY;
    }
    circleData.hilightIndex++;
    if(circleData.hilightIndex > 100) {
        circleData.hilightIndex = 0;
    }
    view.draw();
    setTimeout(function() {shiverLoop();}, 200);
}

function getReunaLogoGroup(scale, color1, color2, pos) {
    var Rtop = drawReunaTop(color1);
    var Rbottom = drawReunaBottom(color2);
    var g = new paper.Group();
    g.addChild(Rtop);
    g.addChild(Rbottom);
    g.scale(scale);
    g.translate(pos);
    return g;
}

function drawReunaTop(fColor) {
    var rtop = new Path();
    rtop.add(new Point(-30, -40));  
    rtop.add(new Segment(new Point(-2.5, -40), null, new Point(17.5, 0)));
    rtop.add(new Segment(new Point(30, -12.5), new Point(0, -17.5), new Point(0, 17.5)));
    rtop.add(new Segment(new Point(-2.5, 15), new Point(17.5, 0), null));
    rtop.add(new Point(-30, 15));
    rtop.closed = true;
    rtop.strokeColor = null;
    rtop.fillColor = fColor;
    return rtop;
}

function drawReunaBottom(fColor) {
    var rbottom = new Path();
    rbottom.add(new Point(-30, -20));
    rbottom.add(new Point(30, 40));
    rbottom.add(new Point(-30, 40));
    rbottom.closed = true;
    rbottom.strokeColor = null;
    rbottom.fillColor = fColor; 
    return rbottom;
}
