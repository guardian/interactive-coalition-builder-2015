define([
    'd3',
    'json!data/mapping.json',
    'json!data/analysis.json'
], function(
    d3,
    mapTable,
    analysisData
) {
    'use strict';

    var id = "#playground",
        windowSize = getWindowSize(),
        width = 320 || windowSize.width || 320,
        height = 480 || windowSize.height || 480,
        dataSeat = [],
        r = width / 2 - 32,
        cx = r + 16,
        cy = r, 
        txtPick, parties, txtList;

    function render(rawData) {

        /* data */
        var data = rawData.sheets.SUM,
            imgSize = 66;

     dataSeat = [
            { party: "con"   , color: "#005789", group: 1 }, 
            { party: "lab"   , color: "#E31F26", group: 1 }, 
            { party: "snp"   , color: "#FCDD03", group: 2 },
            { party: "ld"    , color: "#FFB900", group: 2 },
            { party: "ukip"  , color: "#7D0069", group: 2 },
            { party: "dup"   , color: "#99002E", group: 2 },
            { party: "grn"   , color: "#33A22B", group: 2 },
            { party: "pc"    , color: "#868686", group: 2 },
            { party: "sdlp"  , color: "#008587", group: 2 },
            { party: "others", color: "#B3B3B4", group: 2 }
        ];
        
        dataSeat.map(function(d, i) {            
            d.seat = data[0][d.party]; //seat count
            d.size = data[1][d.party]; //radius size 
            d.active = false;

            // group 2, calculate position
            if (d.group === 2) {
                console.log(i-1);
                d.top = getY(i-1, d.size);//hexagon.vertices[i-2].y;
                d.left = getX(i-1, d.size);//hexagon.vertices[i-2].x;
            }
            return d;
        });
        // group 1
        dataSeat[0].top  = cy - dataSeat[0].size/2;
        dataSeat[0].left = cx + imgSize / 2 + 10 - dataSeat[0].size/2;
        dataSeat[1].top  = cy - dataSeat[1].size/2;
        dataSeat[1].left = cx - imgSize / 2 - 10 - dataSeat[1].size/2;
        //console.log(dataSeat);
        
        
        /* view */
        var sum = 0;

        txtPick = d3.select(".js-pickme");
        parties = d3.select(id)
        .style("height", width + "px")
        .selectAll("div")
        .data(dataSeat);

        parties
        .style("top", function(d) { return d.top + "px"; })
        .style("left", function(d) { return d.left + "px"; })
        .style("width", function(d) { return d.size + "px"; })
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
            //console.log(d.seat, sum);
            updateSum(sum);
            updateAnimation(sum);
            updateAnalysis(d.party, d.active);
        })
        .classed("animate", function(d, i) {
            return i > 1 ? false : true;
        });

        txtPick
        .style("top", cy - 30 + "px")
        .style("left", cx - 28 + "px")
        .classed("animate-delay", true);

        var ul = document.createElement("ul");
        analysisData.forEach(function(d) {
            var tn = document.createTextNode(d.text),
                li = document.createElement("li"), 
                h3 = document.createElement("h3");
            h3.textContent = d.pair;
            li.className = "hide"; 
            li.dataset.index = d.index;
            li.appendChild(h3);
            li.appendChild(tn);
            ul.appendChild(li); 
        });
        document.querySelector(".js-analysis").appendChild(ul);
    }

    function updateSum(sum) {
        var txtCongrats = (sum > 325) ? ", Bravo!" : "";
        document.querySelector(".js-sum").textContent = sum + txtCongrats;
    }

    function updateAnalysis(party, active) {
        var activeParties = [];       
        dataSeat.forEach(function(d) {
            if (d.active) {
                activeParties.push(d.party);
            }   
        });      
        //console.log(mapTable[party]);
        activeParties.forEach(function(d) {
            var index = mapTable[party][d],
                data = analysisData[index - 1];
            if (data !== undefined) {

                if (active && (activeParties.length > 1)) {
                    d3.select("[data-index='"+index+"']")
                    .classed("show", true)
                    .classed("hide", false);
                    //console.log("select");
                } else if (!active) {
                    d3.select("[data-index='"+index+"']")
                    .classed("show", false)                   
                    .classed("hide", true);                   
                    //console.log("deselect");
                }
                //console.log(index);
                //console.log(party, "X", d);
                //console.log(data);
            }
        });
    }

    function updateAnimation(sum) {

        if (sum > 325) {
            txtPick
            .classed("animate-delay", false)
            .classed("d-n", true);

            parties.classed("animate", false);
            return;
        }
        // party group control       
        var isActive = dataSeat[0].active || dataSeat[1].active; 
        if (isActive) {
            txtPick
            .classed("animate-delay", false)
            .classed("d-n", true);

            parties.classed("animate", function(d, i) {
                return i > 1 ? true : false;
            });
        } else {
            txtPick
            .classed("animate-delay", true)
            .classed("d-n", false);

            parties.classed("animate", function(d, i) {
                //console.log(d.active);
                return i > 1 ? false : true; 
            });
        }
        //console.log(isActive, "group1");
        //console.log(sum>325, "majority");
    }

    function selectImage(isSelected, party, color) {
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

    function getWindowSize() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;

        return {
            width: x, 
            height: y
        };    
    }
    
    function getX(i, size) { 
        return cx + r * Math.cos(2 * Math.PI * i / 8) - size/2;
    }
    function getY(i, size) { 
        return cy + r * Math.sin(2 * Math.PI * i / 8) - size/2;
    }
    
    return {
        render: render
    };
});
