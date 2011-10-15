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



/* paperjs stuff below */
$(function() {
    paper.install(window);
    paper.setup('reunacanvas');
    var tool = new Tool();

    var centerPoint = new Point(view.center.x, 230);
    var scaleAmount = 3.5;

    var rtop = new Path();
    rtop.add(new Point(20, 10));  
    rtop.add(new Segment(
                new Point(47.5, 10),
                null,
                new Point(17.5, 0)));
    rtop.add(new Segment(
                new Point(80, 42.5),
                new Point(0, -17.5),
                new Point(0, 17.5)));
    rtop.add(new Segment(
                new Point(47.5, 75),
                new Point(17.5, 0),
                null));
    
    rtop.add(new Point(20, 75));
    rtop.closed = true;
    rtop.strokeColor = null;
    rtop.fillColor = new paper.RGBColor(255, 255, 255);

    var rbottom = new Path();
    rbottom.add(new Point(20, 30));
    rbottom.add(new Point(80, 90));
    rbottom.add(new Point(20, 90));
    rbottom.closed = true;
    rbottom.strokeColor = null;
    rbottom.fillColor = '#eeeeee';
   
    var blueprintR = new Group(rtop, rbottom);

    blueprintR.scale(scaleAmount, new Point(20, 10));
    blueprintR.translate(centerPoint);

    var logos = new Array();
    var fadeCounter = 0;
    logos.push(blueprintR);
    blueprintR.position = centerPoint;

    var line1 = new Path(
                    new Point(0, blueprintR.bounds.bottom), 
                    new Point(blueprintR.bounds.right, blueprintR.bounds.bottom)
                    );
    line1.strokeWidth = 0;
    line1.strokeColor = 'red';

    var line2 = new Path(
                    new Point(blueprintR.bounds.left, 0), 
                    new Point(blueprintR.bounds.left, blueprintR.bounds.bottom)
                    );
    line2.strokeWidth = 0;
    line2.strokeColor = 'blue';

    for(i = 1; i < 20; i++) {
        logos.push(blueprintR.clone());
        logos[i].scale(0.9 - 0.045 * i);
        logos[i].opacity = 0.8 - 0.04 * i;
        logos[i].moveBelow(logos[i-1]);
    }

    logos[0].moveAbove(project.activeLayer.lastChild);
    
    function moveR(index, delta) {
        logos[index].position.x = centerPoint.x + delta.x * index;
        logos[index].position.y = centerPoint.y + delta.y * index;
    }

    tool.onMouseMove = function(event) {
        var dx = (centerPoint.x - event.point.x) / 10;
        var dy = (centerPoint.y - event.point.y) / 10;
        for(var i = 0; i < logos.length; i++) {
            moveR(i, new Point(dx, dy)); 
        }
    }

    view.onFrame = function(event) {
        for(var i = 1; i < logos.length; i++) {
            if(Math.round(event.time) % i == 0) {
                logos[i].children[0].fillColor.red = Math.round(event.time) - event.time;
                logos[i].children[1].fillColor.red = Math.round(event.time) - event.time;
            } else {
                logos[i].children[0].fillColor.red = 1;
                logos[i].children[1].fillColor.red = 1;
            }
        }

        if(Math.round(event.time) % 2 == 0) {
            line1.opacity *= 1.1;
            line2.opacity *= 0.9;
        } else {
            line1.opacity *= 0.9;
            line2.opacity *= 1.1;
        }
    }

    view.draw();
});










