define([
    'd3'
], function(
    d3
) {
    'use strict';

    var el = "#circlesChart",
        rangeR = {min: 30, max: 60},
        w = document.documentElement.clientWidth  || window.innerWidth  || 320,
        h = document.documentElement.clientHeight || window.innerHeight || 480,
        h = h - 100,
        h2 = h/2,
        dataSeat = [],
        parties = [],
        seats = []; // coalition list

    
    function render(rawData) {

        /* data */
        var data = rawData.sheets.RESULT[0];

        dataSeat = [
            {party: "con" , seat: data.con,    active: true,  fill: "#005789", x: w/5*4, y: h2/2},
            {party: "lab" , seat: data.lab,    active: true,  fill: "#E31F26", x: w/5  , y: h2/2},
            {party: "dup" , seat: data.dup,    active: false, fill: "#D46A4C", x: w/7*4, y: h2/5},
            {party: "grn" , seat: data.green,  active: false, fill: "#33A22B", x: w/2+5, y: h2/7*6},
            {party: "snp" , seat: data.snp,    active: false, fill: "#FCDD03", x: w/3  , y: h2/5*4},
            {party: "ld"  , seat: data.libdem, active: false, fill: "#FFB900", x: w/2  , y: h2/2},
            {party: "pc"  , seat: data.pc,     active: false, fill: "#868686", x: w/7*3, y: h2/4},
            {party: "ukip", seat: data.ukip,   active: false, fill: "#7D0069", x: w/3*2, y: h2/4*3}
        ];

        var arrSeat = dataSeat.map(function(d) { return d.seat; }),
            maxSeat = Math.max.apply(null, arrSeat),
            minSeat = Math.min.apply(null, arrSeat),
            range = d3.scale.linear()
                      .domain([minSeat, maxSeat])
                      .range([rangeR.min, rangeR.max]);

        // add r for drawing
        dataSeat.map(function(d) {
            d.r = Math.round(range(d.seat));
            return d;
        });

        /* chart */
        // chart's size
        var cc = document.querySelector(el);
        cc.setAttribute("style", "width: "  + w + "px");
        cc.setAttribute("style", "height: " + h + "px");

        // chart by d3
        var svg = initSvg(el, dataSeat),
            svgSeat = drawGroups(svg);
        
        drawCircles(svgSeat);
        drawTexts(svgSeat);
    }


    // Calc distance
    /*function getDistance(pos1, pos2) {
      return Math.round(Math.sqrt(Math.pow((pos2.x - pos1.x),2) + Math.pow((pos2.y - pos1.y),2)));
      }*/


    // Define svg
    function initSvg(el, data) {
        return d3.select(el)
        .append("svg")
        .classed("rect-party", true)
        .attr("width", w)
        .attr("height", h)            
        .selectAll("g") 
        .data(data)
        .enter();
    }

    // Define drawing functions
    function drawGroups(svg) {
        return svg.append("g")
        .attr("class", function(d) {
            return d.active? "party g-active" : "party";
        })
        .attr("transform", function(d) { 
            return "translate(" + d.x + "," + d.y + ")"; 
        })
        .call(drag);
    }

    function drawCircles(svg) {
        svg.append("circle")
        .attr("r",  function(d) { return d.r; })   
        .style("fill", function(d) { return d.fill; })
        .classed("c-inactive", function(d){ 
            return d.active ? false : true;   
        });
    }

    function drawTexts(svg) {
        var svgText = svg.append("text")
        .style("fill", "white")
        .attr("text-anchor", "middle");

        svgText.append("tspan")
        .attr("x", function() { return 0; })
        .attr("dy", -3)
        .text(function(d) { return d.party; });  
        svgText.append("tspan")
        .attr("x", function() { return 0; })
        .attr("dy", "1.2em")
        .text(function(d) { return d.seat; });
    }


    // Define drag beavior
    var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("drag", dragMove)
    .on("dragend", dragEnd);

    function dragMove(d) {
        if (d.active === false) { return; }

        /* var sx = d3.event.x - d.x,
           sy = d3.event.y - d.y;*/

        d.x = d3.event.x;
        d.y = d3.event.y;
        d3.select(this).attr("transform", "translate(" + (d.x) + "," + (d.y) + ")");
    }

    function dragEnd(d) {
        var i = parties.indexOf(d.party),
            sumSeats = 0,
            opt = "";

        if (d.y > h2 && i === -1) {
            parties.push(d.party); 
            seats.push(d.seat); 
            //console.log(parties);

            var isCon = parties.indexOf("con"),
                isLab = parties.indexOf("lab");

            if (isCon || isLab) {
                dataSeat.map(function(d) {
                    d.active = true;
                    return d;
                });

                d3.selectAll(".party")
                .classed("g-active", true);
                d3.selectAll("circle")
                .classed("c-inactive", false);
            }
        } else if (d.y < h2 && i !== -1) {
            parties.splice(i, 1);
            seats.splice(i, 1);
        }
        document.querySelector("#txtParties").textContent = parties;

        if (seats.length > 0) {
            sumSeats = seats.reduce(function(pre, cur) {
                return pre + cur;
            });
            if (sumSeats > 325) {
                opt = " (majority!)";
            }
            document.querySelector("#txtSeats").textContent = " => " + sumSeats + " seats" + opt;
        } else {
            document.querySelector("#txtSeats").textContent = "";
            dataSeat.map(function(d) {
                if ((d.party !== "con") && (d.party !== "lab")) {
                    d.active = false;
                }
                //console.log(d.party + " " + d.active);
                return d;
            });

            d3.selectAll(".party")
            .classed("g-active", function(d) { return d.active ? true : false; });
            d3.selectAll("circle")
            .classed("c-inactive", function(d) { return d.active ? false : true; });

        } 
    }   

    return {
        render: render
    };
});
