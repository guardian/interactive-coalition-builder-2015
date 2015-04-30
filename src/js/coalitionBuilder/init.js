define([
    'd3',
    'coalitionBuilder/utilities',
    'coalitionBuilder/dragdrop',
    'coalitionBuilder/updateData',
    'coalitionBuilder/Builder',
    'json!data/mappingTable.json'
], function(
    d3,
    util,
    dragdrop,
    updateData,
    Builder,
    mapTable
) {
    'use strict';

    // data
    var dataSeat = [],
        analysisData = [];
    //mapTable = [];

    // window size
    var windowSize = util.getWindowSize(),
        width = 320 || windowSize.width || 320,
        height = 480 || windowSize.height || 480;

    // playground and octagon
    var id = "#jsPlayground",
        r = width / 2 - 32, //radius of octagon
        cx = r + 20,
        cy = r - 15; 

    function render(rawData) {

        new Builder();

        /* data */
        var data = rawData.sheets.SUM,
            imgSize = 66;

        dataSeat = updateData.initParties(data, cx, cy, r, imgSize);
        analysisData = rawData.sheets.TEXTS;
        //mapTable = rawData.sheets.REF; //TODO: use this!
        
        updateData.setTable(mapTable);
        //console.log(dataSeat);
        //console.log(rawData);


        /* view: dom */
        var parties, txtPick, txtList;
        
        parties = d3.select(id)
        .style("height", height + "px")
        .selectAll("div")
        .data(dataSeat);

        parties
        .style("margin-top", function(d) { return d.y + "px"; })
        .style("margin-left", function(d) { return d.x + "px"; })
        .style("width", function(d) { return d.size + "px"; })
        .style("height", function(d) { return d.size + "px"; })
        .style("z-index", 1)
        .call(dragdrop);

        txtPick = d3.select(".js-pickme");
        
        txtPick
        .style("top", cy - 50 + "px")
        .style("left", cx - 60 + "px")
        .classed("animate-delay", true);

        txtList = document.createElement("ul");
        analysisData.forEach(function(d) {
            var tn = document.createTextNode(d.text),
                li = document.createElement("li"), 
                h3 = document.createElement("h3");
            h3.textContent = d.pair;
            li.className = "hide"; 
            li.dataset.index = d.index;
            li.appendChild(h3);
            li.appendChild(tn);
            txtList.appendChild(li); 
        });
        document.querySelector(".js-analysis").appendChild(txtList);
    
        
        var icons = d3.select("#jsPartyIcons");
        var names = d3.select("#jsPartyNames");
    }


    return render;
});
