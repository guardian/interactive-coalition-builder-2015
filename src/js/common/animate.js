define([
], function(
) {
    'use strict';

    function animate(elem,style,unit,from,to,time,prop) {
        if(!elem) { return; }

        var start = new Date().getTime(),
            timer = setInterval(function() {
            var step = Math.min(1,(new Date().getTime()-start)/time);
            if (prop) {
                elem[style] = (from+step*(to-from))+unit;
            } else {
                elem.style[style] = (from+step*(to-from))+unit;
            }
            if(step === 1) { clearInterval(timer); }
        },25);

        elem.style[style] = from+unit;
    }
    
    function animateScroll(from, to, duration) {
        if (duration <= 0) { return; }
        var difference = to - from;
        var perTick = difference / duration * 10;
        
        //console.log(from, perTick, to); 
        setTimeout(function() {
            //element.scrollTop = element.scrollTop + perTick;
            window.scrollTo(0, from+perTick);
            from += perTick;
            animateScroll(from, to, duration - 10);
        }, 10);
    }


    return animateScroll;
});
