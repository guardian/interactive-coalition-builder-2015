define([
    'd3',
    'json!data/data.json'
], function(
    d3,
    data
) {
    'use strict';

     function coalition(partyData, analysisData) {

        var partyList, txtList, imgPair;
        
        // init section
        d3.select(".js-coalition").classed("d-n", true);
  

        // init coalition summary 
        partyList = d3.select(".js-parties")
        .selectAll("li")
        .data(partyData).enter()
        .append("li")
        .attr("class", function(d) {
            return "pos-r-party d-n party-" + d.party; 
        });

        partyList
        .append("p")
        .attr("class", "f-party-name pos-a-party-name")
        .text(function(d) { return data.partyNameDic[d.party]; });

        partyList
        .append("p")
        .attr("class", "pos-a-party-seat")
        .text(function(d) { return d.seat; });

        partyList
        .append("img")
        .attr("class", function(d) {
            return "img-party bgc-" + d.party;
        })
        .attr("src", function(d) {
            return "@@assetPath@@/imgs/" + d.img + ".png";
        });      
 

        // init analysis list
        txtList = d3.select(".js-analysis")
        .selectAll("li")
        .data(analysisData).enter()
        .append("li")
        .attr("class", "o-h hide")
        .attr("data-index", function(d) {
            return d.index;
        });
        
        txtList
        .append("h3")
        .attr("class", "f-h2")
        .text(function(d) { return data.partyMatchDic[d.mark]; })
        .append("span")
        .attr("class", "c-grey3")
        .text(" because ...");

        imgPair = txtList.append("div");
        imgPair
        .text(function(d) { return d.pair; });

        txtList
        .append("p")
        .text(function(d) { return d.text; });
    }


    return coalition;
});
