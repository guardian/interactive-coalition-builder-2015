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
    
    function scrollTo(element, to, duration) {
        if (duration <= 0) { return; }
        var from = element.scrollTop;
        var difference = to - from;
        var perTick = difference / duration * 10;
        
        console.log(from, to);
        setTimeout(function() {
            element.scrollTop = from + perTick;
            scrollTo(from, to, duration - 10);
            console.log(from, to, "[after]");
        }, 10);
    }


    return scrollTo;
});
