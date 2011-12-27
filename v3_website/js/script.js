function activateCarouselsOnScroll() {
    $('#surfaces-carousel,#interactivity-carousel,#infovis-carousel').each( function(i, el) {
        if(isScrolledIntoView(el)) { resumeNivo(el); }
        else { pauseNivo(el); }
    });
}

function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
}

function pauseNivo(elem) {
    var $elem = $(elem).data('nivoslider').stop();
}
function resumeNivo(elem) {
    $(elem).data('nivoslider').start();
};
    
$(window).load(function() {
    var params = {
                    // effect: 'slideInRight,fade',
                    pauseTime: 3000,
                    slices: 6, // For slice animations
                    boxCols: 4, // For box animations
                    boxRows: 2, // For box animations
                    // afterLoad: activateCarouselsOnScroll,
                  };
    
    $('#surfaces-carousel,#interactivity-carousel,#infovis-carousel').nivoSlider(params);
    
    // pauseNivo('#surfaces-carousel')
    // pauseNivo('#interactivity-carousel')
    // pauseNivo('#infovis-carousel')
    
    activateCarouselsOnScroll();
    
    $(window).scroll(activateCarouselsOnScroll);
        
    $('a.nivo-video-link').colorbox({transition: "fade", iframe: true, width: "90%", height: "90%"});

    $('a.colorbox-video').colorbox({transition: "fade", iframe: true, width: "90%", height: "90%"});
        
    // PAGE SCROLLING (uses jquery)
    $('nav a,a.hilight,a#landing-link').click(function(e) {
        e.preventDefault();
        var href = $(this).attr("href");
        var elementClicked = href;
        var destination = $(elementClicked).offset().top;
        $("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination-20}, 400,
            function() { window.location.href = href; } );
        return false;
    });
    // Sticky Menu
    var e = $('.navigation'), eTop = e.position().top;
    var scrollTop;
    //eTop = e.position().top;
    $(window).resize(function() {
        //console.log(eTop);
        eTop = e.position().top;
    });
    $(window).scroll(function(){
        var wTop = $(this).scrollTop();
        //console.log(wTop+"   "+eTop);
        if(wTop >= eTop){
            e.css({position:'fixed',top:0,left:0}).addClass('sticky');
            $('.landing-page').css({'margin-bottom':'66px'});
        }
        else{
            e.css({position:'relative',top:'auto',left:'auto'}).removeClass('sticky');
            $('.landing-page').css({'margin-bottom':'0'});
        }
    });
});



$(function() {
    var clickPlaces = [];
    var lastDrawTime = 0;
    reuna.canvas.init('landing-canvas');
    reuna.canvas.noFill();
    var w = 10, h = 10;
    var prevMouseX = 0, prevMouseY = 0;
    
    reuna.canvas.draw = function(delta) {
        reuna.canvas.fill();
        var n = reuna.canvas.getElapsedTimeMillis();
        if(n - lastDrawTime > 100) {
            lastDrawTime = n;
            
            /*
            reuna.canvas.setColor(255, 255, 255, 0.8);
            reuna.canvas.rect(  0,
                                0, 
                                reuna.canvas.getWidth(),
                                reuna.canvas.getHeight());
            */
            reuna.canvas.setColor(0, 0, 0, 1);
            for(var i = 0; i < clickPlaces.length; i++) {
                //reuna.canvas.setColor(255 * reuna.canvas.random(),
                //        255 * reuna.canvas.random(),
                //        255 * reuna.canvas.random());
                // reuna.canvas.setColor(255, 255, 255, 1.0);
                /* TODO: add into lib somehow... */
                reuna.canvas._ctx.clearRect(  Math.round(clickPlaces[i][0]) * w + w/2,
                                    Math.round(clickPlaces[i][1]) * h + h/2,
                                    w,
                                    h);
                
                clickPlaces[i][0] = clickPlaces[i][0] + clickPlaces[i][2];
                clickPlaces[i][1] = clickPlaces[i][1] + clickPlaces[i][3];
                
                // 5.0 / (clickPlaces[i][4] + 1) <= replace 1.0 for fade out effect..
                reuna.canvas.setColor(clickPlaces[i][5], clickPlaces[i][6], clickPlaces[i][7], 1.0);
                reuna.canvas.rect(  Math.round(clickPlaces[i][0]) * w + w/2,
                                    Math.round(clickPlaces[i][1]) * h + h/2,
                                    w,
                                    h);
                clickPlaces[i][4]++; // amount of turns alive
                if(clickPlaces[i][4] > 5 && reuna.canvas.random(-1, 1) > 0) {
                    // reuna.canvas.setColor(255, 255, 255, 0.95);
                    reuna.canvas._ctx.clearRect(  Math.round(clickPlaces[i][0]) * w + w/2,
                                    Math.round(clickPlaces[i][1]) * h + h/2,
                                    w,
                                    h);
                    clickPlaces.splice(i, 1);
                }
            }
        }
    };
    
    reuna.canvas.mouseMoved = function(x, y, btn) {
        var delta = Math.sqrt(
                            Math.pow(x - prevMouseX, 2) +
                            Math.pow(y - prevMouseY, 2)
                            )
        prevMouseX = x, prevMouseY = y;
        
        if(delta > 23) {
            createParticles(x, y, false);
        }

    }

    reuna.canvas.mousePressed = function(x, y, btn) {
        createParticles(x, y, true);
    }
    
    function createParticles(x, y, randomColors) {
        var amountOfParticles = reuna.canvas.random(1, 6);
        for(var i = 0; i < amountOfParticles; i++) {
            if(!randomColors) {
                var r = g = b = reuna.canvas.random(30, 180);
            } else {
                var r = reuna.canvas.random(40, 255),
                    g = reuna.canvas.random(40, 255),
                    b = reuna.canvas.random(40, 255);
            }
            clickPlaces.push([  Math.round(x / w), 
                                Math.round(y / h), 
                                reuna.canvas.random(-1, 1),
                                reuna.canvas.random(-1, 1),
                                0,
                                r, g, b]);
        }
    }
    reuna.canvas.run();
    setTimeout(reuna.canvas._resizeHandler, 800);
});

