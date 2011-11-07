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
var hoveringR1 = {curBlinkenDelayIndex: 0};
var hoveringR2 = {curBlinkenDelayIndex: 0};

// delays for on, off, on, off, on, off, etc. should be even to make sure 
// blink is off when getting out
var blinkenLengths = [ [1000, 300, 700, 300, 300, 200, 200, 100, 40, 100], 
                        [150, 150, 150, 150, 150, 150, 150, 100],
                        [200, 100, 200, 100]];

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
    var tool = new Tool();
    with(paper) {
      // learnt lessons:
      // - clipping only seems to work with paths. cant have 
      //   group inside the clipping area
      // - joining does not produce true, flat forms, simplify just messes up with curves
      // - while clipping elements, the top element (mask) defines the color 
      //   for the underlying elems, which sucks badly
    
      g2 = getReunaLogoGroup(2.9,
                      new paper.RGBColor(0.0, 0.3, 0.3), 
                      new paper.RGBColor(0.0, 0.4, 0.4), 
                      new Point(view.center.x, view.center.y));
      g3 = getReunaLogoGroup(2.8, 
                      new paper.RGBColor(0.3, 0.0, 0.3), 
                      new paper.RGBColor(0.4, 0.0, 0.4), 
                      new Point(view.center.x, view.center.y));
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
      g2.opacity = 0.5;
      g3.opacity = 0.3;
      g4.opacity = 0.2;
      g5.opacity = 0.1;
    
      hoveringR1.g = g2;
      hoveringR2.g = g3;
      hoveringR1.position = new Point();
      hoveringR2.position = new Point();
      hoveringR1.position.x = view.center.x;
      hoveringR1.position.y = view.center.y;
      hoveringR2.position.x = view.center.x;
      hoveringR2.position.y = view.center.y;
      hoveringR1.counter = 22;
      hoveringR2.counter = 0;
        
      var mouseSpotted = new Point(0, 0);
      var hoverTowardsPoint = new Point(0, 0);
    
      view.draw();
    
      tool.onMouseMove = function(event) {
          //group.firstChild.position.x = view.center.x - (view.center.x - event.point.x) / 10.0;
          //group.firstChild.position.y = view.center.y - (view.center.y - event.point.y) / 10.0;
          //if(event.point.x - view.center.x < 300 && event.point.y - view.center.y < 300) {
              //if(Math.random() < 1.1) {
                  mouseSpotted = event.point;
              //}
          //}
          g4.position.x = view.center.x + (view.center.x - event.point.x) / 7.0;
          g4.position.y = view.center.y + (view.center.y - event.point.y) / 10.0;
          g5.position.x = view.center.x + (view.center.x - event.point.x) / 12.0;
          g5.position.y = view.center.y + (view.center.y - event.point.y) / 18.0;

      }
    
      setTimeout(function() { shiverLoop(); }, 200);
      hoveringR1.blinkenDelays = blinkenLengths[parseInt(Math.random() * blinkenLengths.length)];
      hoveringR2.blinkenDelays = blinkenLengths[parseInt(Math.random() * blinkenLengths.length)];
        
      setTimeout(function() { blinkR(hoveringR1); }, 1000);
      setTimeout(function() { blinkR(hoveringR2); }, 1400);
    }
}

function shiverLoop() {
    hoveringR1.counter += 1;
    hoveringR2.counter += 1;
    paper.view.draw();    
    setTimeout(function() {shiverLoop();}, 200);
}
function blinkR(rElement) {
    if(rElement.g.opacity > 0) {
        rElement.g.opacity = 0;
    } else {
        rElement.g.opacity = 0.5 + Math.random() * 0.5;
    }
    
    with(paper) {
      view.draw();

      if(rElement.blinkenDelays.length == rElement.curBlinkenDelayIndex) {
          rElement.curBlinkenDelayIndex = 0;
          rElement.blinkenDelays = null;
          rElement.blinkenDelays = blinkenLengths[parseInt(Math.random() * blinkenLengths.length)];
          rElement.g.position.x = view.center.x + 75 - Math.random() * 150;
          rElement.g.position.y = view.center.y + 30 - Math.random() * 60;
          setTimeout(function() { blinkR(rElement); }, 1000 + 10000 * Math.random());
          rElement.g.opacity = 0; // make sure were off..
          return;
      }
    
      setTimeout(
          function() { blinkR(rElement); }, 
          rElement.blinkenDelays[rElement.curBlinkenDelayIndex++]
          );
      }
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