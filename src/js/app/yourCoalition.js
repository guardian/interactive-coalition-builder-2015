define([
    'd3',
    'app/updateData'
], function(
    d3,
    updateData
) {
    'use strict';

     function coalition(partyData, analysisData) {

        var partyList, txtList;

        d3.select(".js-coalition").classed("d-n", true);

        txtList = document.createElement("ul");
        analysisData.forEach(function(d) {
            var tn = document.createTextNode(d.text),
                li = document.createElement("li"), 
                h3 = document.createElement("h3");
            h3.textContent = d.pair;
            li.className = "hide"; 
            li.dataset.index = d.index;
            li.appendChild(h3);
            li.appendChild(tn);
            txtList.appendChild(li); 
        });
        document.querySelector(".js-analysis").appendChild(txtList);


        partyList = d3.select(".js-parties")
        .selectAll("li")
        .data(partyData)
        .enter()
        .append("li")
        .attr("class", function(d) {
            return "pos-r-party d-n party-" + d.party; 
        });

        partyList
        .append("p")
        .classed("f-party-name", true)
        .classed("pos-a-party-name", true)
        .text(function(d) { return updateData.getPartyName(d.party); });

        partyList
        .append("p")
        .classed("pos-a-party-seat", true)
        .text(function(d) { return d.seat; });

        partyList
        .append("img")
        .classed("img-party", true)
        .attr("src", function(d) {
            return "@@assetPath@@/imgs/" + d.img + ".png";
        });      
    }


    return coalition;
});
