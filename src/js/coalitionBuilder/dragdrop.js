define([
    'd3',
    'coalitionBuilder/updateData',
    'coalitionBuilder/updateView'
], function(
    d3,
    updateData,
    updateView
){
    'use strict';

    // screen width, screen height, position x, position y, element
    var sw, sh, px, py, el,
    dragdrop = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragStart)
    .on("drag", dragMove); //throttle
    //.on("dragend", click);


    function dragStart(d) {
        // flag to distinguish dragEnd and click events
        d3.event.sourceEvent.preventDefault(); 

        el = document.querySelector("#playground");
        sw = el.clientWidth - d.size;
        sh = el.clientHeight - d.size;

        el = document.querySelector("[data-party='"+d.party+"']");
        //console.log("dragstart");
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

        // update
        el.style.marginLeft = px + "px";
        el.style.marginTop = py + "px";
        
        // TODO: remove and use dragEnd
        updateData.setSum();
        updateView.sum(updateData.getSum());
        d.x = px;
        d.y = py;  
    }

    function dragEnd(d) {

        if (d3.event.defaultPrevented) { 
            d.x = px;
            d.y = py;  

            updateData.setSum();
            updateView.sum(updateData.getSum());
            /*console.log("dragend");
        } else { 
            console.log("click by click");*/
        }
    }

    //function click() { console.log("click by drag"); }

    return {
        drag: dragdrop,
        dragend: dragEnd
    };
});
