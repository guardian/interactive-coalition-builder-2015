define([
    'd3',
    'app/updateData'
], function(
    d3,
    data
){
    'use strict';

    function updateSum() {
        var sum = data.getSum(),
            txtSeat = (sum > 1) ? " seats" : " seat",
            txtShort = ((326-sum) > 0) ? "just " + (326-sum) + " short of majority" : "Bravo!",
            elsSeat;
        
        document.querySelector(".js-seatshort").textContent = "(" + txtShort + ")";
        
        elsSeat = document.querySelectorAll(".js-seatcount");
        elsSeat[0].textContent = sum + txtSeat;
        elsSeat[1].textContent = sum + txtSeat;
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
                //console.log("select");
                d3.select("[data-index='"+index+"']")
                .classed("show", true)
                .classed("hide", false);
            } else if (!active) {
                //console.log("deselect");
                d3.select("[data-index='"+index+"']")
                .classed("show", false)                   
                .classed("hide", true);                   
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
