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
            return "pos-r-party-list d-n party-" + d.party; 
        });

        partyList
        .append("p")
        .attr("class", "f-p-bb pos-a-party-name")
        .text(function(d) { return data.partyNameDic[d.party]; });

        partyList
        .append("p")
        .attr("class", "pos-a-party-seat")
        .text(function(d) { return d.seat; });

        partyList
        .append("img")
        .attr("class", function(d) {
            return "img-party b-1s" + d.party;
        })
        .attr("src", function(d) {
            return "@@assetPath@@/imgs/pics/" + d.party + "-n.png";
        });      
 

        // init analysis list
        // party list
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

        imgPair = txtList.append("div")
        .attr("class", "pos-r-party-pair fl-pair")
        .each(function(d) { 
            d.partyPair = d.pair.split(",");
        });
        
        txtList
        .append("p")
        .attr("class", "fr-pair")
        .text(function(d) { return d.text; });
    
        // party pair
        imgPair       
        .append("img")
        .attr("class", function(d) {
            return "img-party b-1s" + d.partyPair[0];
        })
        .attr("src", function(d) {
            var path = "@@assetPath@@/imgs/pics/" + 
                d.partyPair[0] + "-" + 
                data.partyImageDic[d.mark] + 
                ".png";
            return path;
        });
        
        imgPair
        .append("div")
        .attr("class", "l-party-plus")
        .text("+");
        
        imgPair       
        .append("img")
        .attr("class", function(d) {
            return "img-party b-1s" + d.partyPair[1];
        })
        .attr("src", function(d) {
            var path = "@@assetPath@@/imgs/pics/" +  
                d.partyPair[1] + "-" +  
                data.partyImageDic[d.mark] + 
                ".png";
            return path;
        });
        
        imgPair
        .append("div")
        .attr("class", "f-p-bb pos-a-party-name-left")
        .text(function(d) {
            return data.partyNameDic[d.partyPair[0]];
        });
        imgPair
        .append("div")
        .attr("class", "f-p-bb pos-a-party-name-right")
        .text(function(d) {
            return data.partyNameDic[d.partyPair[1]];
        });     
     }


    return coalition;
});
