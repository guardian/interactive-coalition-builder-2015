define([
    'd3',
    'app/Builder',
    'app/updateData',
    'common/utilities',
    'common/dragdrop',
    'json!data/mappingTable.json'
], function(
    d3,
    Builder,
    updateData,
    util,
    dragdrop,
    mapTable
) {
    'use strict';

    // window size
    var windowSize = util.getWindowSize(),
        width = windowSize.width || 320/*,
        height = windowSize.height || 480*/;

    var r = width / 2 - 32, //radius of octagon
        cx = r + 20,
        cy = r - 15,
        imgSize = 66; 

    function render(rawData) {

        /* data */
        var data = rawData.sheets.SUM,
            partyData = updateData.initParties(data, cx, cy, r, imgSize),
            analysisData = rawData.sheets.RESULT;
            //mapTable = rawData.sheets.REF; //TODO: use this!
        
        updateData.setTable(mapTable);


        /* view: dom */
        
        new Builder();
        
        //TODO: check the date
        var lastupdateData = new Date(rawData.updated),
            textLastupdate = lastupdateData.toString();
        textLastupdate = textLastupdate.slice(4, -18) + " " + textLastupdate.slice(-4, -1);
        document.querySelector("#jsLastUpdate").textContent = "Last update on " + textLastupdate;

        var txtPick, txtList, coalition;

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


        coalition = d3.select(".js-parties")
        .selectAll("li")
        .data(partyData)
        .enter()
        .append("li")
        .classed("d-n", true)
        //.classed("d-ib", true)
        .classed("pos-r-party", true);

        coalition
        .append("div")
        .classed("f-party-name", true)
        .classed("pos-a-party-name", true)
        .text(function(d) { return updateData.getPartyName(d.party); });

        coalition
        .append("div")
        .classed("pos-a-party-seat", true)
        .text(function(d) { return d.seat; });

        coalition
        .append("img")
        .classed("img-party", true)
        .attr("src", function(d) {
            return "@@assetPath@@/imgs/" + d.img + ".png";
        });      
    }


    return render;
});
