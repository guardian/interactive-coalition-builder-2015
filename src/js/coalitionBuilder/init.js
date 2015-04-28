define([
    'd3',
    'coalitionBuilder/utilities',
    'coalitionBuilder/dragdrop',
    'json!data/mappingTable.json'
], function(
    d3,
    util,
    dragdrop,
    mapTable
) {
    'use strict';
    
    var dataSeat = [],
        //mapTable = [];
        analysisData = [];

    var id = "#playground",
        windowSize = util.getWindowSize(),
        width = 320 || windowSize.width || 320,
        height = 480 || windowSize.height || 480,
        r = width / 2 - 32,
        cx = r + 20,
        cy = r - 15, 
        txtPick, parties, txtList;

    function render(rawData) {

        /* data */
        console.log(rawData);
        var data = rawData.sheets.SUM,
            imgSize = 66;

        dataSeat = [
            { party: "con"   , color: "#005789", group: 1, img:"con3" }, 
            { party: "lab"   , color: "#E31F26", group: 1, img:"lab3" }, 
            { party: "ld"    , color: "#FFB900", group: 2, img:"ld2" },
            { party: "snp"   , color: "#FCDD03", group: 2, img:"snp2" },
            { party: "grn"   , color: "#33A22B", group: 2, img:"others" },
            { party: "pc"    , color: "#868686", group: 2, img:"others" },
            { party: "sdlp"  , color: "#008587", group: 2, img:"others" },
            { party: "others", color: "#B3B3B4", group: 2, img:"others" },
            { party: "dup"   , color: "#99002E", group: 2, img:"others" },
            { party: "ukip"  , color: "#7D0069", group: 2, img:"others" }
        ];
        
        dataSeat.map(function(d, i) {            
            d.seat = data[0][d.party]; //seat count
            d.size = data[1][d.party]; //radius size 
            d.active = false;

            // group 2, calculate position
            if (d.group === 2) {
                d.x = util.getOctagonX(i-1, r, cx, d.size);
                d.y = util.getOctagonY(i-1, r, cy,  d.size);
            }
            return d;
        });
        // group 1
        dataSeat[0].x = cx + imgSize / 2 + 10 - dataSeat[0].size/2;
        dataSeat[0].y  = cy - dataSeat[0].size/2;
        dataSeat[1].x = cx - imgSize / 2 - 10 - dataSeat[1].size/2;
        dataSeat[1].y  = cy - dataSeat[1].size/2;
        //console.log(dataSeat);
        
        //mapTable = rawData.sheets.REF;
        analysisData = rawData.sheets.TEXTS;


        /* view */
        var sum = 0;

        txtPick = d3.select(".js-pickme");
        parties = d3.select(id)
        .style("height", height + "px")
        .selectAll("div")
        .data(dataSeat);

        parties
        //.classed("animate", function(d, i) { return i > 1 ? false : true; }) 
        .style("margin-top", function(d) { return d.y + "px"; })
        .style("margin-left", function(d) { return d.x + "px"; })
        .style("width", function(d) { return d.size + "px"; })
        .style("height", function(d) { return d.size + "px"; })
        .style("z-index", 1);
                
        txtPick
        .style("top", cy - 50 + "px")
        .style("left", cx - 60 + "px")
        .classed("animate-delay", true);

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
       

        /* events */ 
        parties
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
        .call(dragdrop);
    }

    
    /* Event Handlers */
    function updateSum(sum) {
        var //txtCongrats = (sum > 325) ? ", Bravo!" : "",
            txtSeat = (sum > 1) ? " seats" : " seat",
            txtShort = ((326-sum) > 0) ? "just " + (326-sum) + " short" : "Bravo!";
        document.querySelector(".js-seatcount").textContent = sum + txtSeat;
        document.querySelector(".js-seatshort").textContent = "(" + txtShort + ")";
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

            //parties.classed("animate", false);
            return;
        }
        // party group control       
        var isActive = dataSeat[0].active || dataSeat[1].active; 
        if (isActive) {
            txtPick
            .classed("animate-delay", false)
            .classed("d-n", true);

            /*parties.classed("animate", function(d, i) {
                return i > 1 ? true : false;
            });*/
        } else {
            txtPick
            .classed("animate-delay", true)
            .classed("d-n", false);

            /*parties.classed("animate", function(d, i) {
                //console.log(d.active);
                return i > 1 ? false : true; 
            });*/
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


    return render;
});
