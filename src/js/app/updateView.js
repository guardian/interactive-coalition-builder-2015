define([
    'd3',
    'app/updateData',
    'json!data/data.json'
], function(
    d3,
    updateData,
    data
){
    'use strict';

    function updateSum() {
        var sum = updateData.getSum(),
            txtSeat = (sum > 1) ? " seats" : " seat",
            txtShort = ((326-sum) > 0) ? "just " + (326-sum) + " short of majority" : "Bravo!",
            btnDone = d3.select(".js-done"),
            elsSeat, elSum;
        
        elSum = d3.select(".js-sum");
        if (sum > 0) {
            elSum.classed("d-n", false).classed("d-b", true); 
        } else {
            elSum.classed("d-n", true).classed("d-b", false); 
        }    
          
        document.querySelector(".js-seatshort").textContent = "(" + txtShort + ")";
        
        elsSeat = document.querySelectorAll(".js-seatcount");
        elsSeat[0].textContent = sum + txtSeat;
        elsSeat[1].textContent = sum + txtSeat;

        if (sum > 325) {
            btnDone.classed("d-b", true).classed("d-n", false);
        } else {
            btnDone.classed("d-b", false).classed("d-n", true);
        }
    }

    var to;
    function updateFeedback(isActive, isAngry) {
        var el = d3.select(".js-feedback");
        if (isActive) { 
            el.classed("d-n", false)
            .classed("d-b", true)
            //.classed("animate", true)
            .text(isAngry ? "Bad match!" : "Match!!"); 
            
            if(to) {
                clearTimeout(to);
                to=null;
            }
            
            to=setTimeout(function() {
                el.classed("d-b", false)
                .classed("d-n", true);
            }, 7000);



        } else {
            el.classed("d-b", false)
            .classed("d-n", true);
        } 
    }
    
    function updateAnalysis(party, isActive) {
        var partyData = updateData.getParties();

        var partyList = partyData.filter(function(d) {
            return d.active;
        }).map(function(d) {
            return d.party;
        }); 
        updateData.setCoalition(partyList);     
        //console.log(party, isActive);
        //console.log(partyList);

        //TODO: update section
        if (partyList.length > 0) {
            d3.select(".js-coalition")
            .classed("d-n", false)            
            .classed("d-b", true);            
        } else {
            d3.select(".js-coalition")
            .classed("d-n", true)            
            .classed("d-b", false);
        }


        //TODO: update summary
        // change face type
        var el;
        partyData.filter(function(d) {
            return d.active;
        }).forEach(function(d) {
            var type = "h",
                isRepulsive= false,
                repulsiveList = d.repulsion.concat(d.strong_repulsion).join(" "),
                isNeutral = false,
                neutralList = d.neutral.join(" ");
            
            isNeutral = partyList.find(function(p) {
                return neutralList.indexOf(p) > -1;
            });

            isRepulsive = partyList.find(function(p) {
                return repulsiveList.indexOf(p) > -1;
            });
            
            if (isNeutral !== undefined) { type = "n"; } 
            if (isRepulsive !== undefined) { type = "a"; }
            
            //console.log(d.party, type);
            el = document.querySelector(".js-parties .party-" + d.party + " img"); 
            el.src = "@@assetPath@@/imgs/pics/" + d.party + "-" + type + ".png";
        });

        // hide and show faces
        el = d3.select(".js-parties .party-" + party); 
        if (isActive) { 
            el.classed("d-n", false).classed("d-ib", true); 
        } else if (!isActive) {
            el.classed("d-n", true).classed("d-ib", false); 
        }
        
        // update numbers and text
        var isMajority = updateData.getSum() > 325,
            txtFlag = isMajority ? "" : "not";
        
        var isConLib = false,
            isLabSnp = false,
            partyString = partyList.join(" ");
        
        d3.select(".js-not").text(txtFlag);
        
        isConLib = (partyString.indexOf("con") > -1) && (partyString.indexOf("libdem") > -1);
        isLabSnp = (partyString.indexOf("lab") > -1) && (partyString.indexOf("snp") > -1);
       
        if (isConLib) { 
            d3.select(".js-conlib").classed("d-b", true).classed("d-n", false);
        } else { 
            d3.select(".js-conlib").classed("d-b", false).classed("d-n", true); 
        }
        if (isLabSnp) {
            d3.select(".js-labsnp").classed("d-b", true).classed("d-n", false); 
        } else {
            d3.select(".js-labsnp").classed("d-b", false).classed("d-n", true);
        }
    
        if (isConLib && isLabSnp) { 
            d3.select(".js-conlib").classed("d-b", false).classed("d-n", true);
            d3.select(".js-labsnp").classed("d-b", false).classed("d-n", true);
        }       
        //console.log(isConLib, isLabSnp); 
        
        
        //TODO: update analysis list
        partyList.forEach(function(d) {
            var table = data.indexTable[party],
                index = table[d];

            if (table === undefined) { return; } 
            if (index === undefined) { return; }
            
            if (isActive && (partyList.length > 1)) {
                //console.log("select");
                //d3.select("[data-index='"+index+"']")
                d3.select(".index-"+index)
                .classed("show", true)
                .classed("hide", false);
            } else if (!isActive) {
                //console.log("deselect");
                //d3.select("[data-index='"+index+"']")
                d3.select(".index-"+index)
                .classed("show", false)                   
                .classed("hide", true);                   
            }
        });
    }   
    
 
    return {
        sum: updateSum,
        analysis: updateAnalysis,
        updateFeedback: updateFeedback,
    };
});
