define([
    'd3',
    'app/Builder',
    'app/yourCoalition',
    'app/updateData',
    'common/utilities',
    'common/buttons.js',
    'json!data/mappingTable.json'
], function(
    d3,
    Builder,
    yourCoalition,
    updateData,
    util,
    socialButtons,
    mapTable
) {
    'use strict';


    function render(rawData) {

        // window size
        var windowSize = util.getWindowSize(),
            width = windowSize.width || 320;

        var r = width / 2 - 32, //radius of octagon
            cx = r + 20,
            cy = r - 15,
            imgSize = 66; 

        
        /* data */
        var data = rawData.sheets.SUM,
            partyData = updateData.initParties(data, cx, cy, r, imgSize),
            analysisData = rawData.sheets.RESULT;

        updateData.setTable(mapTable);


        // section 1
        //TODO: check the date
        var lastupdateData = new Date(rawData.updated),
            textLastupdate = lastupdateData.toString();
        textLastupdate = textLastupdate.slice(4, -18) + " " + textLastupdate.slice(-4, -1);
        document.querySelector("#jsLastUpdate").textContent = "Last update on " + textLastupdate;

        // section 2
        new Builder();

        var txtPick = d3.select(".js-pickme");

        txtPick
        .style("top", cy - 50 + "px")
        .style("left", cx - 60 + "px")
        .classed("animate-delay", true);


        // section 3
        yourCoalition(partyData, analysisData);    
        socialButtons();
    }


    return render;
});
