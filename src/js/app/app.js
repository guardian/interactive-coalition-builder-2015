define([
    'd3',
    'app/Builder',
    'app/Coalition',
    'app/updateData',
    'common/utilities',
    'common/buttons.js'
], function(
    d3,
    Builder,
    yourCoalition,
    updateData,
    util,
    socialButtons
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
            analysisData = rawData.sheets.RESULT,
            partyData = updateData.initParties(data, analysisData);




        /* view */
        // section 1
        //TODO: check the date
        var lastupdateData = new Date(rawData.updated),
            textLastupdate = lastupdateData.toString();
        textLastupdate = textLastupdate.slice(4, -18) + " " + textLastupdate.slice(-4, -1);
        document.querySelector("#jsLastUpdate").textContent = "Last update on " + textLastupdate;

        // section 2
        new Builder({
            bench:"#bench",
            playground:"#playground",
            data:partyData
        });

        d3.select(".js-pickme")
        .style("top", cy - 50 + "px")
        .style("left", cx - 60 + "px")
        .classed("animate-delay", true);

        // section 3
        yourCoalition(partyData, analysisData);    
        socialButtons();
    }


    return render;
});
