define([
    'd3',
    'coalitionBuilder/utilities',
    'coalitionBuilder/dragdrop',
    'coalitionBuilder/updateData',
    'coalitionBuilder/Builder',
    'json!data/mappingTable.json'
], function(
    d3,
    util,
    dragdrop,
    updateData,
    Builder,
    mapTable
) {
    'use strict';

    // data
    var dataSeat = [],
        analysisData = [];
    //mapTable = [];

    // window size
    var windowSize = util.getWindowSize(),
        width = 320 || windowSize.width || 320,
        height = 480 || windowSize.height || 480;

    // playground and octagon
    var id = "#playground",
        r = width / 2 - 32, //radius of octagon
        cx = r + 20,
        cy = r - 15; 

    // d3 binding
    var parties, txtPick, txtList;


    function render(rawData) {

        new Builder();

        /* data */
        var data = rawData.sheets.SUM,
            imgSize = 66;

        dataSeat = updateData.init(data, cx, cy, r, imgSize);
        analysisData = rawData.sheets.TEXTS;
        //mapTable = rawData.sheets.REF; //TODO: use this!

        //console.log(dataSeat);
        //console.log(rawData);


        /* view: dom */
        //var sum = 0;

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
        /*.on("click", function(d) {
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
            })*/
        .call(dragdrop.drag)
        .on("click", dragdrop.dragend);
    }


    /* Event Handlers */
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
