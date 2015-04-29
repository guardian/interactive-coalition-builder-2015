define([
    'd3',
    'coalitionBuilder/updateData'
], function(
    d3,
    data
){
    'use strict';

    function updateSum() {
        var sum = data.getSum(),
            txtSeat = (sum > 1) ? " seats" : " seat",
            txtShort = ((326-sum) > 0) ? "just " + (326-sum) + " short" : "Bravo!";
        document.querySelector(".js-seatcount").textContent = sum + txtSeat;
        document.querySelector(".js-seatshort").textContent = "(" + txtShort + ")";
    }

    function updateAnalysis(party, active) {
        var partyData = data.getParties(),
            mappingTable = data.getTable();

        var partyList = partyData.filter(function(d) {
            return d.active;
        }).map(function(d) {
            return d.party;
        });      
        //console.log(partyList);

        partyList.forEach(function(d) {
            var table = mappingTable[party],
                index = table[d];

            if (table === undefined) { return; } 
            if (index === undefined) { return; }
            if (index === "x") { return; }
            
            if (active && (partyList.length > 1)) {
                d3.select("[data-index='"+index+"']")
                .classed("show", true)
                .classed("hide", false);
                //console.log("select");
            } else if (!active) {
                d3.select("[data-index='"+index+"']")
                .classed("show", false)                   
                .classed("hide", true);                   
                //console.log("deselect");
            }
        });
    }   


    return {
        sum: updateSum,
        analysis: updateAnalysis
    };
});
