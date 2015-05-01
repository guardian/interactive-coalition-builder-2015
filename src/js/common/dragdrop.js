define([
    'd3',
    'app/updateData',
    'app/updateView'
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
    .on("drag", dragMove) //throttle
    .on("dragend", dragEnd);


    function dragStart(d) {
        //console.log("dragstart");

        el = document.querySelector("#jsPlayground");
        sw = el.clientWidth - d.size;
        sh = el.clientHeight - d.size;

        el = document.querySelector("[data-party='"+d.party+"']");
        
        px = d.x;
        py = d.y;
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
    }

    function dragEnd(d) { 
        
        d.x = px;
        d.y = py; 
        
        updateData.setSum();
        
        updateView.sum();
        updateView.analysis(d.party, d.active);
        updateView.animation(d.party, d.active);
        
        //console.log("dragend"); 
    }


    return dragdrop;
});
