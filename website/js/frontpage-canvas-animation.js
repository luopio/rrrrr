/* make sure the namespace exists */
if(typeof(reuna) == 'undefined')
    reuna = {canvas:{}};
else if(typeof(reuna.canvas) == 'undefined')
    reuna.canvas = {};

function echo(msg) {
    try {
        if(console && console.debug) { console.debug(msg); }
    } catch(e) {;}
}

reuna.canvas.init = function(canvas_id, drawCallback) {
    reuna.canvas._canvas = document.getElementById(canvas_id);
    reuna.canvas._isIE = (function() {
        var div = document.createElement('div');
        div.innerHTML = '<!--[if IE]><i></i><![endif]-->';
        return (div.getElementsByTagName('i').length === 1);         
        }());
    if (reuna.canvas._canvas.getContext) {  
        var realWidth = reuna.canvas._canvas.clientWidth;
        reuna.canvas._canvas.setAttribute("width", realWidth);
        reuna.canvas._width = realWidth;
        var realHeight = reuna.canvas._canvas.clientHeight;
        reuna.canvas._height = realHeight;
        reuna.canvas._canvas.setAttribute("height", realHeight);
        echo("reuna.canvas.init: set canvas to size "+realWidth+","+realHeight);
        reuna.canvas._ctx = reuna.canvas._canvas.getContext('2d');
        reuna.canvas.setColor(0, 0, 0, 255);
        reuna.canvas.fill();
        reuna.canvas.setLineWidth(1);
        reuna.canvas._targetFPS = 30.0;
        reuna.canvas._initCallbackRoutine(window, Date);
        if(drawCallback) { reuna.canvas.draw = drawCallback; }
        window.addEventListener('click', reuna.canvas._mousePressedRouter, false);
    } else {  
        echo('reuna.canvas.init: no support for canvas!');
        return false;
    }
}

reuna.canvas.draw = false;

reuna.canvas.random = function(v1, v2) {
    return v1 && v2 ? 
        v1 + Math.random() * (v2-v1) :
        Math.random();
}

reuna.canvas.getWidth = function() {
    return reuna.canvas._width;
}

reuna.canvas.getHeight = function() {
    return reuna.canvas._height;
}

reuna.canvas.run = function() {
    if(!reuna.canvas.draw) { return false; }
    reuna.canvas._minimumFrameInterval = 
        1000 / reuna.canvas._targetFPS;
    var now = now && now > 1E4 ? now : +new Date;
    reuna.canvas._startAnimationTime = now;
    window._animLoop(reuna.canvas.draw, reuna.canvas._canvas);
}

reuna.canvas.setColor = function(r, g, b, a) {
    if(!a) {
        a = 1.0;
    } else {
        // no more need to remember if it's float or hex
        if(a > 1) { a = a / 255.0; }
    }
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);
    reuna.canvas._ctx.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
    reuna.canvas._ctx.strokeStyle = "rgba("+r+","+g+","+b+","+a+")";
}

reuna.canvas.setLineWidth = function(w) {
    reuna.canvas._ctx.lineWidth = w;
}

reuna.canvas.rect = function(x1, y1, w, h) {
    reuna.canvas._ctx.moveTo(0, 0);  
    if(reuna.canvas._fillModeOn) {
        reuna.canvas._ctx.fillRect(x1, y1, w, h);
    } else {
        reuna.canvas._ctx.strokeRect(x1, y1, w, h);
    }
}

reuna.canvas.triangle = function(x1, y1, x2, y2, x3, y3) {
    reuna.canvas._ctx.moveTo(0, 0);  
    reuna.canvas._ctx.beginPath();  
    reuna.canvas._ctx.moveTo(x1,y1);  
    reuna.canvas._ctx.lineTo(x2,y2);
    reuna.canvas._ctx.lineTo(x3,y3);
    reuna.canvas._ctx.lineTo(x1,y1);  
    reuna.canvas._useFillOrStroke();
}

reuna.canvas._useFillOrStroke = function() {
    if(reuna.canvas._fillModeOn) {
        reuna.canvas._ctx.fill(); 
    } else {
        reuna.canvas._ctx.stroke(); 
    }
}

reuna.canvas.fill = function() {
    reuna.canvas._fillModeOn = true;
}

reuna.canvas.noFill = function() {
    reuna.canvas._fillModeOn = false;
}

reuna.canvas.circle = function(x, y, radius) {
    reuna.canvas._ctx.beginPath();  
    reuna.canvas._ctx.arc(x, y, radius, 0, 2 * Math.PI, true);  
    reuna.canvas._useFillOrStroke();
}

reuna.canvas.ellipse = function(x, y, w, h) {
}

reuna.canvas.line = function(x1, y1, x2, y2) {
    reuna.canvas._ctx.moveTo(0, 0);  
    reuna.canvas._ctx.moveTo(x1, y1);
    reuna.canvas._ctx.lineTo(x2, y2);
}

reuna.canvas.roundedRect = function(x, y, width, height, radius) {  
    with(reuna.canvas) {
        _ctx.beginPath();  
        _ctx.moveTo(x,y+radius);  
        _ctx.lineTo(x,y+height-radius);  
        _ctx.quadraticCurveTo(x,y+height,x+radius,y+height);  
        _ctx.lineTo(x+width-radius,y+height);  
        _ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);  
        _ctx.lineTo(x+width,y+radius);  
        _ctx.quadraticCurveTo(x+width,y,x+width-radius,y);  
        _ctx.lineTo(x+radius,y);  
        _ctx.quadraticCurveTo(x,y,x,y+radius);  
        _useFillOrStroke();
    }
}

reuna.canvas.pushStyle = function() {
    reuna.canvas._ctx.save();
}

reuna.canvas.popStyle = function() {
    reuna.canvas._ctx.restore();
}

reuna.canvas.getElapsedTimeMillis = function() {
    var now = now && now > 1E4 ? now : +new Date;
    return now - reuna.canvas._startAnimationTime;
}

// AnimationLoop from https://gist.github.com/1114293#file_anim_loop_x.js
// enables efficient animation timing
// TODO: how could we support setFrameRate(FPS)
// Cross browser, backward compatible solution
reuna.canvas._initCallbackRoutine = function( window, Date ) {
    // feature testing
    var raf = window.mozRequestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              window.oRequestAnimationFrame;
    window._animLoop = function( render, element ) {
        var running, lastFrame = +new Date;
        function loop( now ) {
            if ( running !== false ) {
                raf ?
                raf( loop, element ) :
                setTimeout( loop, 16 ); // fallback to setTimeout
                // Make sure to use a valid time, since:
                // - Chrome 10 doesn't return it at all
                // - setTimeout returns the actual timeout
                now = now && now > 1E4 ? now : +new Date;
                var deltaT = now - lastFrame;
                // do not render frame when deltaT is too high
                if( deltaT < 160 ) {
                    // && deltaT > reuna.canvas._minimumFrameInterval
                    if(reuna.canvas._automaticClear) {
                        reuna.canvas._ctx.clearRect(0, 
                                                    0, 
                                                    reuna.canvas._width,
                                                    reuna.canvas._height);
                    }
                    running = render( deltaT, now );
                }
                lastFrame = now;
            }
      }
      loop();
    };
}

reuna.canvas._mousePressedRouter = function(e) {
    if(e.target != reuna.canvas._canvas)
        return false;
        
    var btn = e.button,
        x = e.clientX - e.target.offsetLeft,
        y = e.clientY - e.target.offsetTop;
    // 0, 1, 2 = l, m, r, IE: 1, 4, 2 = l, m, r
    if(reuna.canvas._isIE) {
        if(btn == 1) btn = 0;
        else if(btn == 4) btn = 1; 
    }
    echo("e.rel" + e.target.offsetTop)
    reuna.canvas.mousePressed(x, y, btn);
}

