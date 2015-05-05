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
            cy = r - 15;
        
        /* data */
        var sumData = rawData.sheets.SUM,
            textData = rawData.sheets.TEXT,
            analysisData = rawData.sheets.RESULT,
            partyData = updateData.initParties(sumData, analysisData);


        /* view */
        // section 1
        d3.select(".js-headline").textContent = textData[0].headline;
        d3.select(".js-standfirst").textContent = textData[0].context;
        
        //TODO: check the date
        var lastupdateData = new Date(rawData.updated),
            textLastupdate = lastupdateData.toString();

        textLastupdate = textLastupdate.slice(4, -18) + " " + textLastupdate.slice(-4, -1);
        document.querySelector("#jsLastUpdate").textContent = "Last update on " + textLastupdate;

        // section 2
        var builder=new Builder({
            bench:"#bench",
            playground:"#playground",
            data:partyData
        });
        
        //TODO: check position
        //builder.getPickMe()
        d3.select(".js-pickme")
            .style("top", 130 + "px")
            .classed("animate-delay", true);

        // section 3
        yourCoalition(partyData, analysisData);    
        socialButtons();
        
        document.querySelector(".js-conlib").textContent = textData[2].context; 
        document.querySelector(".js-labsnp").textContent = textData[3].context;
    }


    return render;
});
