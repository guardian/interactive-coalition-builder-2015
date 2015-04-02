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
        curCoalition = [],
        allCoalitions = []; 

    function render(rawData) {

        /* data */
        var data = rawData.sheets.RESULT[0];
        // add seat and active
        partyData.forEach(function(d) {
            d.seat = data[d.key]; 
            d.active = false; 

            parties.push(d.key);
        });

        /* view */
        // init party list
        d3.select(".js-parties")
        .selectAll("li")
        .data(partyData).enter()
        .append("li")
        .attr("data-party", function(d) { return d.key; })
        .attr("class", function(d) { return "c-" + d.key; })
        .text(function(d) { return d.name; });
        
        // init coalition list
        d3.select(".js-coalition-cur")
        .selectAll("li")
        .data(partyData).enter()
        .append("li")
        .attr("class", function(d) { return d.key + " bgc-" + d.key; });

        /* interaction */
        d3.selectAll(".js-parties li")
        .on("click", onPartyClick);
        d3.select(".js-btn-add")
        .on("click", onAddClick);
    }

    function onAddClick() {
        // copy cur coalition
        var cur, curClone;
        cur = document.querySelector(".js-coalition-cur");
        curClone = cur.cloneNode(true);
        curClone.className = "ul-no-style ul-coalition";
        
        // add cur coaltion to the list
        /* data */
        allCoalitions.push(curCoalition);
        console.log(curCoalition);
        console.log(allCoalitions);
        /* view */
        document.querySelector(".js-coalition-all")
        .appendChild(curClone);

        // reset cur coalition
        /* data */        
        partyData.forEach(function(d) {
            d.active = false;
        });
        /* view */
        resetPartyAndCurCoalition();
    }
    

    function onPartyClick() {
        /* data */
        var party = this.dataset.party,
            iParties = parties.indexOf(party),
            iCurParties = curCoalition.indexOf(party),
            flag = partyData[iParties].active;
        // update partyData and curCoalition
        partyData[iParties].active = flag ? false : true;
        if (iCurParties === -1) {
            curCoalition.push(party);
        } else {
            curCoalition.splice(iCurParties, 1);
        }   
        //console.log(curCoalition);

        /* view */
        var len = curCoalition.length;
        if (len === 0) {
            console.log(len);
            d3.select(".js-toggle-empty").classed("d-n", false);
            d3.select(".js-toggle-chart").classed("d-n", true);
        } else {
            console.log(document.querySelector("js-toggle-chart"));
            d3.select(".js-toggle-empty").classed("d-n", true);
            d3.select(".js-toggle-chart").classed("d-n", false);
        }
        // chart
        d3.select(this).classed("active", !d3.select(this).classed("active")); //toggle
        updateCurCoalition(party); 
    }

    function updateCurCoalition(party) {
        d3.select(".js-coalition-cur ." + party)
        .transition()
        .style("width", function(d) {
            return d.active ? d.seat + "px" : 0;
        });
    }
    
    function resetPartyAndCurCoalition() {
        curCoalition = [];
        d3.selectAll(".js-parties li")
        .classed("active", false);
        d3.selectAll(".js-coalition-cur li")
        .style("width", "0px");
    }

    return {
        render: render
    };
});
