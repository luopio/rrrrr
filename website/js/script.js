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


var hoveringR1 = {};
var hoveringR2 = {};

/* paperjs stuff below */
$(function() {
    paper.install(window);
    paper.setup('reunacanvas');
    var tool = new Tool();
    
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
    
    // c = new Path.Circle(view.center, 2);
    // c.fillColor = 'ff00ff';
    
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
    
    setTimeout(function() { 
            shiverLoop(); 
        }, 200);
});

function shiverLoop() {
    hoveringR1.counter += 1;
    hoveringR2.counter += 1;
    hoveringR1.g.position.x = hoveringR1.position.x + 1.5 - Math.random() * 3;
    hoveringR1.g.position.y = hoveringR1.position.y + 1.5 - Math.random() * 3;
    hoveringR2.g.position.x = hoveringR2.position.x + 1.5 - Math.random() * 3;
    hoveringR2.g.position.y = hoveringR2.position.y + 1.5 - Math.random() * 3;
    
    if(hoveringR1.counter > 42) {
        hoveringR1.position.x = view.center.x + 75 - Math.random() * 150;
        hoveringR1.position.y = view.center.y + 30 - Math.random() * 60;
        hoveringR1.counter = 0;
    }
    if(hoveringR2.counter > 36) {
        hoveringR2.position.x = view.center.x + 100 - Math.random() * 200;
        hoveringR2.position.y = view.center.y + 50 - Math.random() * 100;
        hoveringR2.counter = 0;
    }
    
    if(hoveringR1.counter > 6) {
        hoveringR1.g.opacity = 0.0;
    } else {
        hoveringR1.g.opacity += -0.1 + Math.random() * 0.3;
    }
    if(hoveringR2.counter > 8) {
        hoveringR2.g.opacity = 0.0;
    } else {
        hoveringR2.g.opacity += -0.1 + Math.random() * 0.2;
    }
    
/*  
    g4.position.x = view.center.x + (view.center.x - mouseSpotted.x) / 18.0;
    g4.position.y = view.center.y + (view.center.y - mouseSpotted.y) / 18.0;
    g5.position.x = view.center.x + (view.center.x - hoverTowardsPoint.x) / 24.0;
    g5.position.y = view.center.y + (view.center.y - hoverTowardsPoint.y) / 24.0;
*/
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
    rtop.add(new Segment(
                new Point(-2.5, -40),
                null,
                new Point(17.5, 0)));
    rtop.add(new Segment(
                new Point(30, -12.5),
                new Point(0, -17.5),
                new Point(0, 17.5)));
    rtop.add(new Segment(
                new Point(-2.5, 15),
                new Point(17.5, 0),
                null));
    
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

