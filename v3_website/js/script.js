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
    //eTop = e.position().top;
    $(window).resize(function() {
        //console.log(eTop);
        eTop = e.position().top;
    });
    $(window).scroll(function(){
        var wTop = $(this).scrollTop();
        //console.log(wTop+"   "+eTop)
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