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
    
    var eCoalition;   

    function updateSum() {
        var eSum = d3.select(".js-sum"),
            eSeatshort = document.querySelector(".js-seatshort"),
            eSeats = document.querySelectorAll(".js-seatcount");

        var sum = updateData.getSum(),
            txtSeat = (sum > 1) ? " seats" : " seat",
            txtShort = ((326-sum) > 0) ? "(just " + (326-sum) + " short of majority)" : "";
        
        if (sum > 0) {
            eSum.classed("d-n", false).classed("d-b", true); 
        } else {
            eSum.classed("d-n", true).classed("d-b", false); 
        }    
          
        eSeatshort.textContent = txtShort;
        
        eSeats[0].textContent = sum + txtSeat;
        eSeats[1].textContent = sum + txtSeat;
    }

    function updateFeedback(isActive, isAngry) {
        var eFeedback = d3.select(".js-feedback"),
            tFeedback = ""; 
         
        if (!isActive) {
            eFeedback.classed("d-b", false).classed("d-n", true);
            return;
        } else {
            tFeedback = ""; 
            console.log(isAngry);
       
            //TODO: move this update to Feedback
            /*if (sum > 325) {
                btnDone.classed("d-b", true).classed("d-n", false);
            } else {
                btnDone.classed("d-b", false).classed("d-n", true);
            }*/
        } 
    }


    function updateAnalysis(party, isActive) {
        var eTxtNot = d3.select(".js-not"),
            eConLib = d3.select(".js-conlib"),
            eLabSnp = d3.select(".js-labsnp");

        var partyData = updateData.getParties(),
            partyList = partyData.filter(function(d) {
            return d.active;
        }).map(function(d) {
            return d.party;
        }); 
        updateData.setCoalition(partyList);     
        //console.log(party, isActive);
        //console.log(partyList);

        //TODO: update section
        eCoalition = d3.select(".js-coalition");
        if (partyList.length > 0) {
            eCoalition
            .classed("d-n", false)            
            .classed("d-b", true);            
        } else {
            eCoalition
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
        
        eTxtNot.text(txtFlag);
        
        isConLib = (partyString.indexOf("con") > -1) && (partyString.indexOf("libdem") > -1);
        isLabSnp = (partyString.indexOf("lab") > -1) && (partyString.indexOf("snp") > -1);
       
        if (isConLib) { 
            eConLib.classed("d-b", true).classed("d-n", false);
        } else { 
            eConLib.classed("d-b", false).classed("d-n", true); 
        }
        if (isLabSnp) {
            eLabSnp.classed("d-b", true).classed("d-n", false); 
        } else {
            eLabSnp.classed("d-b", false).classed("d-n", true);
        }
    
        if (isConLib && isLabSnp) { 
            eConLib.classed("d-b", false).classed("d-n", true);
            eLabSnp.classed("d-b", false).classed("d-n", true);
        }       
        //console.log(isConLib, isLabSnp); 
        
        
        //TODO: update analysis list
        partyList.forEach(function(d) {
            var table = data.indexTable[party],
                index = table[d];

            if (table === undefined) { return; } 
            if (index === undefined) { return; }
            
            if (isActive && (partyList.length > 1)) {
                d3.select(".index-" + index)
                .classed("show", true)
                .classed("hide", false);
            } else if (!isActive) {
                d3.select(".index-" + index)
                .classed("show", false)                   
                .classed("hide", true);                   
            }
        });
    }   
    
    function reset() {
        // update sum
        updateSum();
         
        // update feedback
        //TODO: updateFeedback();

        // update analysis
        eCoalition
        .classed("d-b", false)
        .classed("d-n", true);
        d3.selectAll(".js-parties li")
        .classed("d-ib", false)
        .classed("d-n", true);
        d3.selectAll(".js-analysis li")
        .classed("show", false)
        .classed("hide", true);
    }


    return {
        sum: updateSum,
        analysis: updateAnalysis,
        feedback: updateFeedback,
        reset: reset
    };
});
