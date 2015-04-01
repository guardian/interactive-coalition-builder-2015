define([
    'd3',
    'json!data/sampleData.json'
], function(
    d3,
    sampleData
) {
    'use strict';

    var partyData = [
        { key: "lab"   , name: "Lab" },
        { key: "snp"   , name: "SNP" },
        { key: "green" , name: "Grn" },
        { key: "others", name: "Others" },
        { key: "pc"    , name: "PC" },
        { key: "dup"   , name: "DUP" },
        { key: "ukip"  , name: "Ukip" },
        { key: "libdem", name: "LD" },
        { key: "con"   , name: "Con" }
    ],
    parties = [],
    curParties = [],
    allParties = []; 

    function render(rawData) {

        /* data */
        var data = rawData.sheets.RESULT[0];
        // add seat
        partyData.forEach(function(d) {
            d.seat = data[d.key]; 
            d.active = false; 
            
            parties.push(d.key);
        });

        /* view */
        var eParties = d3.select(".js-parties"),
            eCoalition = d3.select(".js-coalition-cur");

        partyData.forEach(function(d) {
            // party list for selection
            eParties
            .append("li")
            .attr("data-party", d.key)
            .classed("c-"+d.key, true)
            .text(d.name);
            
            // party list for chart
            eCoalition
            .append("li")
            .classed("bgc-"+d.key, true)
            .style("width", d.seat+"px");
        });
        // coalition list
        // ...

        /* interaction */
        d3.selectAll(".js-parties li")
        .on("click", onPartyClick);
        d3.select(".js-add")
        .on("click", onAddClick);
    }
    
    function onAddClick() {
        // add cur coalition to the list
        var curCoalition = document.querySelector(".js-coalition-cur"),
            cloneCurCoalition = curCoalition.cloneNode(true);
        
        document.querySelector(".js-coalition-all")
                .appendChild(cloneCurCoalition);

        // reset cur coalition        
        partyData.forEach(function(d) {
            d.active = false;
        });
        d3.selectAll(".js-parties li").classed("active", false);
        updateCurCoalition(); 
    }

    function onPartyClick() {
        /* data */
        var party = this.dataset.party,
            iParties = parties.indexOf(party),
            iCurParties = curParties.indexOf(party),
            flag = partyData[iParties].active;
        // update partyData and curParties
        partyData[iParties].active = flag ? false : true;
        if (iCurParties === -1) {
            curParties.push(party);
        } else {
            curParties.splice(iCurParties, 1);
        }   
        console.log(curParties);

        /* view */
        // toggle the class of a party
        d3.select(this).classed("active", !d3.select(this).classed("active"));
        updateCurCoalition(); 
    }

    function updateCurCoalition() {
        d3.selectAll(".js-coalition-cur li")
          .data(partyData)
          .classed("active", function(d) {
              return d.active;
          });
    }


    return {
        render: render
    };
});
