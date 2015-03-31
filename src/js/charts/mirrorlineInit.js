define([
    'd3',
    'charts/mirrorlineDraw'
], function(
    d3,
    CoalitionsMirrorLineChart
) {
    'use strict';
    
    var chart;
    var format=d3.time.format("%d/%m/%Y");
    
    function render(data) {
        //console.log(data.sheets["Log Seats"]);

        var dataSeats=data.sheets["Log Seats"];
        dataSeats.forEach(function(d){
            d.date=format.parse(d.logdate);
            //d.others+=(d["dup"]+d["pc"])
        });

        var today=format.parse(data.sheets["RESULT"][0]["currentdate"]);
        dataSeats = dataSeats.filter(function(d){
            return +d.date !==  (+today);
        });
        var dataLatest=(function(latest){
            latest.logdate=format.parse(latest.date);
            latest.others+=(latest["dup"]+latest["pc"]);
            return latest;
        }(data.sheets["RESULT"][0]));
        dataLatest.date=today;
        dataSeats.push(dataLatest);

        var coalitions={
            "left":["lab","snp"],
            "right":["con","libdem"]
        };
        
        chart=new CoalitionsMirrorLineChart(dataSeats,{
            container:"#seats",
            fields:coalitions,
            interpolate:"step"
        });
        
        function addRemoveParty(side,party) {
            if(coalitions[side].indexOf(party)===-1) {
                coalitions[side].push(party);
            } else {
                coalitions[side]=coalitions[side].filter(function(d){
                    return d!==party;
                });
            }
            chart.setCoalition(coalitions[side],side);
            chart.update();
        }
        d3.selectAll("#legend ul.left li")
        .on("click",function(){
            var __this=d3.select(this);
            __this
            .classed("deselected", !__this.classed("deselected"));
            var party=__this.attr("rel");
            addRemoveParty("left",party);
        });
        d3.selectAll("#legend ul.right li")
        .on("click",function(){
            var __this=d3.select(this);
            __this
            .classed("deselected", !__this.classed("deselected"));
            var party=__this.attr("rel");
            addRemoveParty("right",party);
        });
    }   
    
    return {
        render: render
    };
});
