define([
    'd3',
    'coalitionBuilder/utilities'
], function(
    d3,
    util
){
    'use strict';

    var sw, sh, el, px, py,
        dragdrop = d3.behavior.drag()
            .origin(function(d) { return d; })
            .on("dragstart", dragStart)
            .on("drag", dragMove)
            //.on("drag", util.throttle(dragMove, 300))
            .on("dragend", dragEnd);
    

    function dragStart(d) {
        el = document.querySelector("#playground");
        sw = el.clientWidth - d.size;
        sh = el.clientHeight - d.size;
        
        el = document.querySelector("[data-party='"+d.party+"']");
    }

    function dragMove(d) {
        px = d3.event.x;
        py = d3.event.y;
        
        // detect playground boundary 
        switch (true) {
            case (px < 0):  px = 0;  break;
            case (px > sw): px = sw; break;
            case (py < 0):  py = 0;  break;
            case (py > sh): py = sh; break;
        }
        
        // detect selection
        d.active  = (py > (sh / 2)) ? true : false;

        el.style.marginLeft = px + "px";
        el.style.marginTop = py + "px";
    }
 
    function dragEnd(d) {
        d.x = px;
        d.y = py;

        el = null;
        px = null;
        py = null;

        if(d.active) {
            console.log(d.party, "is selected");
            //TODO: update data            
        }
    }

   
    return dragdrop;
});
