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
        document.querySelector(".js-seatshort").textContent = "(" + txtShort + ")";
        document.querySelector(".js-seatcount").textContent = sum + txtSeat;
        //TODO: on the sec. one as well
    }

    function updateAnimation() {
        var sum = data.getSum(),
            partyData = data.getParties(),
            isActive = partyData[0].active || partyData[1].active, 
            txtPick = d3.select(".js-pickme");
        
        // case: sum
        if (sum > 325) {
            txtPick
            .classed("animate-delay", false)
            .classed("d-n", true);
            return;
        }
        
        // case: group1 is active      
        if (isActive) {
            txtPick
            .classed("animate-delay", false)
            .classed("d-n", true);
        } else {
            txtPick
            .classed("animate-delay", true)
            .classed("d-n", false);
        }
        //console.log(isActive, "group1");
        //console.log(sum>325, "majority");
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
        
        //TODO: update summary
        //TODO: update pair list
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
    
    function updateImage(isSelected, party, color) {
        var el = document.querySelector("div[data-party=" + party + "] img"),
            imgStr = "con lab snp ld",
            hasImg = imgStr.indexOf(party) !== -1,
            img = hasImg ? party : "others";

        //TODO: remove src, use sprint instead
        if (isSelected) {
            el.style.borderColor = color;
            el.src = "@@assetPath@@/imgs/" + img + "1.png";
        } else {
            el.style.borderColor = "#eee";
            el.src = "@@assetPath@@/imgs/" + img + "3.png";
        } 
    }


    return {
        sum: updateSum,
        analysis: updateAnalysis,
        animation: updateAnimation,
        image: updateImage
    
    };
});
