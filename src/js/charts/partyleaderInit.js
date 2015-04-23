define([
    'd3'
], function(
    d3
) {
    'use strict';

    var id = "#playground",
        w = document.documentElement.clientWidth  || window.innerWidth  || 320,
        //h = document.documentElement.clientHeight || window.innerHeight || 480,
        dataSeat = [];

    
    function render(rawData) {

        /* data */
        var data = rawData.sheets.RESULT[0];

        dataSeat = [
            {party: "con" , seat: data.con,    color: "#005789", top: 100, left: w-95},
            {party: "lab" , seat: data.lab,    color: "#E31F26", top: 100, left: 0},
            {party: "snp" , seat: data.snp,    color: "#FCDD03", top: 0,   left: 170},
            {party: "ld"  , seat: data.libdem, color: "#FFB900", top: 200, left: 60},
            {party: "ukip", seat: data.ukip,   color: "#7D0069", top: 0,   left: 60},
            {party: "grn" , seat: data.green,  color: "#33A22B", top: 200, left: 170}
            //{party: "dup" , seat: data.dup,    top: 0, left: 150},
            //{party: "pc"  , seat: data.pc,     top: , left: 150},
        ];
        console.log(dataSeat);
        
        dataSeat.map(function(d) {
            d.active = false;
            return d;
        });

        var sum = 0;

        d3.select(id)
        .selectAll("div")
        .data(dataSeat)
        .style("top", function(d) { return d.top + "px"; })
        .style("left", function(d) { return d.left + "px"; })
        .on("click", function(d) {
            if (d.active) {
                sum -= d.seat;
                d.active = false;
                selectImage(false, d.party);
            } else {
                sum += d.seat;
                d.active = true;
                selectImage(true, d.party, d.color);
            }
            console.log(d.seat, sum);
            updateSum(sum);
        });
    }

    function updateSum(sum) {
        var txtCongrats = (sum > 325) ? ", Congrates!" : "";
        document.querySelector(".js-sum").textContent = sum + txtCongrats;
    }
    function selectImage(isSelected, party, color) {
        var el = document.querySelector("div[data-party=" + party + "] img"),
            imgStr = "con lab snp ld",
            hasImg = imgStr.indexOf(party) !== -1,
            img = hasImg ? party : "others";
        
        if (isSelected) {
            el.style.borderColor = color;
            el.src = "@@assetPath@@/imgs/" + img + "1.png";
        } else {
            el.style.borderColor = "#eee";
            el.src = "@@assetPath@@/imgs/" + img + "3.png";
        } 
    }


    return {
        render: render
    };
});
