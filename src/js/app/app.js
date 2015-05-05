define([
    'd3',
    'app/Builder',
    'app/Coalition',
    'app/updateData',
    'common/animate.js',
    'common/buttons.js'
], function(
    d3,
    Builder,
    yourCoalition,
    updateData,
    animateScroll,
    socialButtons
) {
    'use strict';


    function render(rawData) {
        //TODO: data and date will be fixed after the election result comes out

        /* data */
        var date = rawData.sheets.LASTUPDATE[0],
            textData = rawData.sheets.TEXT,
            sumData = rawData.sheets.SUM,
            analysisData = rawData.sheets.RESULT,
            partyData = updateData.initParties(sumData, analysisData);


        /* view */

        // section 1
        d3.select(".js-headline").textContent = textData[0].headline;
        d3.select(".js-standfirst").textContent = textData[0].context;
        
        var //lastupdateData = new Date(rawData.updated),
            lastupdateData = new Date(date.currentdate + " " + date.currenttime),
            textLastupdate = lastupdateData.toString();
        
        textLastupdate = textLastupdate.slice(4, -18) + " " + textLastupdate.slice(-4, -1);
        document.querySelector("#jsLastUpdate").textContent = "Last update on " + textLastupdate;
        //console.log(date);
        //console.log(new Date(date.currentdate + " "  + date.currenttime));

        // section 2
        var builder=new Builder({
            bench:"#bench",
            playground:"#playground",
            data:partyData
        });
          

        /*d3.select(".js-pickme")
        .style("top", 130 + "px")
        .classed("animate-delay", true);
        */

        /*var el = document.querySelector(".js-btn-done"), 
            anchor  = document.querySelector(".js-coalition"); 
        el.addEventListener("click",runScroll,false);
        function runScroll() {
        animateScroll(
            el,
            anchor.offsetTop,
            1000
        );}*/
        
        
        // section 3
        yourCoalition(partyData, analysisData);    
        socialButtons();
        
        document.querySelector(".js-conlib").textContent = textData[2].context; 
        document.querySelector(".js-labsnp").textContent = textData[3].context;
    }


    return render;
});
