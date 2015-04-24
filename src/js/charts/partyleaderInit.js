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
        txtPick, parties, txtList;

    function render(rawData) {

        /* data */
        var data = rawData.sheets.RESULT[0],
            imgSize = 66,
            hexagon = getHexagon(width, height, imgSize);

        dataSeat = [
            { party: "con" , seat: data.con,    color: "#005789", group: 1, 
                top: hexagon.center.y, left: hexagon.center.x + imgSize/2 + 10},
                { party: "lab" , seat: data.lab,    color: "#E31F26", group: 1, 
                    top: hexagon.center.y, left: hexagon.center.x - imgSize/2 - 10},
                    { party: "snp" , seat: data.snp,    color: "#FCDD03", group: 2 },
                    { party: "ukip", seat: data.ukip,   color: "#7D0069", group: 2 },
                    { party: "dup" , seat: data.dup,    color: "#99002E", group: 2 },
                    { party: "ld"  , seat: data.libdem, color: "#FFB900", group: 2 },
                    { party: "grn" , seat: data.green,  color: "#33A22B", group: 2 },
                    { party: "pc"  , seat: data.pc,     color: "#868686", group: 2 }
        ];
        //console.log(dataSeat);

        dataSeat.map(function(d, i) {
            d.active = false;
            if (d.group === 2) {
                d.top = hexagon.vertices[i-2].y;
                d.left = hexagon.vertices[i-2].x;
            }

            return d;
        });

        var sum = 0;

        txtPick = d3.select(".js-pickme");
        parties = d3.select(id)
        .style("height", hexagon.height + imgSize + "px")
        .selectAll("div")
        .data(dataSeat);

        parties
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
            //console.log(d.seat, sum);
            updateSum(sum);
            updateAnimation(sum);
            updateAnalysis(d.party, d.active);
        })
        .classed("animate", function(d, i) {
            return i > 1 ? false : true;
        });

        txtPick
        .style("top", hexagon.center.y - 30 + "px")
        .style("left", hexagon.center.x - 28 + "px")
        .classed("animate-delay", true);

        var ul = document.createElement("ul");
        analysisData.forEach(function(d) {
            var tn = document.createTextNode(d.text),
                li = document.createElement("li"), 
                h3 = document.createElement("h3");
            h3.textContent = d.pair;
            li.className = "d-n"; 
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
                    .classed("d-n", false);
                    //console.log("select");
                } else if (!active) {
                    d3.select("[data-index='"+index+"']")
                    .classed("d-n", true);                   
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

    function getHexagon(width, height, imgSize) {
        var h = (Math.sqrt(3)/2),
            r = ((width < height) ? width/2 : height/2) - imgSize/2, //responsive radius, 50%
            shift = 4/5,
            x = r*h,
            y = r - imgSize/2,
            hexagonPos = [
            {x: x,       y: y - r*shift},
            {x: x + r*h, y: y - r/2},
            {x: x + r*h, y: y + r/2},
            {x: x,       y: y + r*shift},
            {x: x - r*h, y: y + r/2},
            {x: x - r*h, y: y - r/2}
        ];

        return {
            center: {x:x, y:y},
            height: r*shift*2,
            vertices: hexagonPos
        };
    }

    return {
        render: render
    };
});
