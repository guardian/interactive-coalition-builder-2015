define([
    'd3'
], function(
    d3
) {
    'use strict';

    function CoalitionsMirrorLineChart(data,options) {

        var WIDTH=800,
            HEIGHT=300;

        var margins={
            top:20,
            bottom:20,
            left:20,
            right:20
        };

        var DURATION=0;

        var padding={
            top:10,
            bottom:10,
            left:0,
            right:0
        };
        var timeSelector;
        var extents={};

        if(options.extents && options.extents.date) {
            data=data.filter(function(d){
                return d.date>=options.extents.date[0] && d.date<=options.extents.date[1];
            });
        }

        function updateData() {
            data.forEach(function(d){
                d.cRight=d3.sum(options.fields["right"],function(p){
                    return d[p];
                });
                d.cLeft=d3.sum(options.fields["left"],function(p){
                    return d[p];
                });
            });

            //console.log(data);

            extents.date=d3.extent(data,function(d){
                return d.date;
            });


            var y_extents=[
                d3.min(data.map(function(d){
                    return d3.min([d.cLeft,d.cRight]);
                })),
                Math.max(325,d3.max(
                    data.map(
                        function(d){
                            return d3.max([d.cLeft,d.cRight]);
                        }
                    )
                )
                        )
            ];

            if(!extents.y) {
                extents.y=y_extents;
            } else {
                var diff1=y_extents[1]-y_extents[0],
                    diff2=extents.y[1]-extents.y[0],
                    diff_diff=Math.abs(diff1-diff2);

                //console.log("old",extents.y[0],extents.y[1]);
                //console.log("new",y_extents);


                //console.log(diff2,diff1,diff_diff,diff2/diff1);

                //extents.y=y_extents;


                if(y_extents[0]<extents.y[0] && y_extents[1]>extents.y[1]) {
                    //console.log("upd all");
                    extents.y=y_extents;
                }


                if(y_extents[0]<extents.y[0]) {
                    //console.log("upd bottom");
                    extents.y[0]=y_extents[0];
                }
                if(y_extents[1]>extents.y[1]) {
                    //console.log("upd top");
                    extents.y[1]=y_extents[1];
                }

                if(extents.y[1]>325 && y_extents[1]<=325) {
                    extents.y[1]=y_extents[1];
                }
                if(extents.y[1]<325 && y_extents[1]>=325) {
                    extents.y[1]=y_extents[1];
                }

                if(diff2/diff1>1) {
                    extents.y=y_extents;
                }


                /*
                   if(y_extents[1]>extents.y[1]) {
                   extents.y[1]=y_extents[1]
                   }
                   */  
            }



            //console.log(extents);


        }
        updateData();






        var svg=d3.select(options.container)
        //.style("width",Math.round(window.innerWidth*(window.innerWidth<=960?1:0.8))+"px")
        .append("svg")
        .attr("width",WIDTH)
        .attr("height",HEIGHT);
        /*<marker xmlns="http://www.w3.org/2000/svg" id="triangle" viewBox="0 0 10 10" refX="0" refY="5" 
          markerUnits="strokeWidth" markerWidth="4" markerHeight="3" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z"/>
          </marker>*/
        svg.append("marker")
        .attr({
            id:"triangle-end",
            "viewBox":"0 0 10 10",
            "refX":10,                  
            "refY":5,
            markerUnits:"strokeWidth",
            markerWidth:8,
            markerHeight:6,
            orient:"auto"
        })
        .append("path")
        .attr({
            "d":"M 0 0 L 10 5 L 0 10 z",
            "fill":"#888"
        });


        svg.append("marker")
        .attr({
            id:"triangle-start",
            "viewBox":"0 0 10 10",
            "refX":0,                   
            "refY":5,
            markerUnits:"strokeWidth",
            markerWidth:8,
            markerHeight:6,
            orient:"auto"
        })
        .append("path")
        .attr({
            "d":"M 0 0 L 10 5 L 0 10 z",
            "fill":"#888"
        })
        .attr("transform","rotate(180 5 5)");

        var defs=svg.append("defs");

        var gradient_w2g=defs.append("linearGradient")
        .attr({
            id:"grad_w2g",
            x1:"0%",
            y1:"0%",
            x2:"100%",
            y2:"0%"
        });
        gradient_w2g.append("stop")
        .attr({
            offset:"0%",
            "class":"white"
        });
        gradient_w2g.append("stop")
        .attr({
            offset:"100%",
            "class":"gray"
        });

        var gradient_g2w=defs.append("linearGradient")
        .attr({
            id:"grad_g2w",
            x1:"0%",
            y1:"0%",
            x2:"100%",
            y2:"0%"
        });
        gradient_g2w.append("stop")
        .attr({
            offset:"0%",
            "class":"gray"
        })
        gradient_g2w.append("stop")
        .attr({
            offset:"100%",
            "class":"white"
        })

        var arrows=svg.append("g")
        .attr("id","arrows")

        var electionDay=new Date(2015,4,7);
        var xscale=d3.time.scale().domain([extents.date[0],electionDay]).range([0,(WIDTH-(margins.left+margins.right+padding.left+padding.right))/2]);
        var xscaleLeft=xscale.copy().domain([electionDay,extents.date[0]]);

        var yscale=d3.scale.linear()
        .domain(extents.y)
        .range([HEIGHT-(margins.bottom+margins.top+padding.top+padding.bottom),padding.bottom]);//.nice();


        var axes=svg.append("g")
        .attr("id","axes")
        .attr("transform","translate("+margins.left+","+(HEIGHT-margins.bottom)+")");

        var linecharts=svg.append("g")
        .attr("class","linecharts")
        .attr("transform","translate("+margins.left+","+margins.top+")");


        var xaxis,xaxis2,majority;


        var lineRight = d3.svg.line()
        .x(function(d) { return -xscale(d.date); })
        .y(function(d) { return yscale(d.value); })
        var lineLeft = d3.svg.line()
        .x(function(d) { return xscale(d.date); })
        .y(function(d) { return yscale(d.value); })
        if(options.interpolate) {
            lineRight.interpolate(options.interpolate)
            lineLeft.interpolate(options.interpolate)
        }

        var area = d3.svg.area()
        .x(function(d) { return xscale(d.date); })
        .y0(HEIGHT-(margins.bottom+margins.top))
        .y1(function(d) { return yscale(d.value); })

        /*linechart
          .append("path")
          .attr("class","area")
          .attr("d",area(data))
          .style({
          fill:"url(#diagonalHatch)"
          })*/

        this.setCoalition=function(parties,side) {
            options.fields[side]=parties;
        }

        this.update=function() {
            update();
        }   

        function update() {
            updateData();
            yscale.domain(extents.y);
            updateVisuals();
        }
        function updateVisuals() {
            var __data=(["cRight","cLeft"]).map(function(d){
                return {
                    party:d,
                    values:data.map(function(p){
                        return {
                            date:p.date,
                            value:p[d]
                        }
                    })
                }
            });

            xaxis.select("g.majority")
            .transition()
            .duration(DURATION)
            .attr("transform",function(){
                var y=yscale(325)-(HEIGHT-margins.bottom-margins.top);
                return "translate(0,"+y+")";
            })

            axes.select("line.coalitions-diff")
            .classed("hidden",function(){
                var y1=yscale(__data[0].values[__data[0].values.length-1].value),
                    y2=yscale(__data[1].values[__data[1].values.length-1].value);
                return Math.abs(y1-y2)<20;
            })
            .transition()
            .duration(DURATION)
            .attr("y1",function(d){
                var val=__data[0].values[__data[0].values.length-1].value
                return  -yscale.range()[0]+yscale(val)-padding.bottom-padding.top;
            })
            .attr("y2",function(d){
                var val=__data[1].values[__data[1].values.length-1].value
                return  -yscale.range()[0]+yscale(val)-padding.bottom-padding.top;
            })



            var linechart=linecharts.selectAll("g.linechart")
            .data(__data)

            linechart.select("path.line")
            .transition()
            .duration(DURATION)
            .attr("d",function(d){
                if(d.party=="cLeft") {
                    return lineLeft(d.values)
                }
                return lineRight(d.values)
            })

            linechart
            .select("text.label")
            .attr("x",function(d){
                if(d.party=="cRight") {
                    return -xscale(extents.date[1])-8;//+2;
                }
                return xscale(extents.date[1])+8;//-2;
            })
            .transition()
            .duration(DURATION)
            .attr("y",function(d){
                var delta=10,
                    v1=d.values[d.values.length-1].value,
                    v2=d.values[d.values.length-8].value;
                if(v2<v1) {
                    delta=-10;
                }
                return yscale(d.values[d.values.length-1].value)+4;//+delta
            })
            .text(function(d){
                return (d.values[d.values.length-1].value);//+" seats"
            })

            linechart
            .select("line.to-election-day")
            .transition()
            .duration(DURATION)
            .attr("y1",function(d){
                return yscale(d.values[d.values.length-1].value)
            })
            .attr("y2",function(d){
                return yscale(d.values[d.values.length-1].value)
            })

            linechart
            .select("circle.label")
            .transition()
            .duration(DURATION)
            .attr("cy",function(d){
                return yscale(d.values[d.values.length-1].value)
            })

            linechart
            .select("line.d1")
            .transition()
            .duration(DURATION)
            .attr("y1",function(d){
                return yscale(d.values[d.values.length-1].value)
            })
            .attr("y2",function(d){
                //console.log(d,extents)
                return yscale(extents.y[0])+padding.bottom+padding.top;
            })

            linechart
            .select("line.d0")
            .transition()
            .duration(DURATION)
            .attr("y1",function(d){
                return yscale(d.values[0].value)
            })
            .attr("y2",function(d){
                return yscale(extents.y[0])+padding.bottom+padding.top;
            })

            linechart
            .select("line.diff")
            .classed("hidden",function(d){
                var y1=yscale(d.values[d.values.length-1].value),
                    y2=yscale(325);
                return Math.abs(y1-y2)<20;
            })
            .transition()
            .duration(DURATION)
            .attr("y1",function(d){
                var delta=-5;
                if(d.values[d.values.length-1].value>325) {
                    delta=5;
                }
                return yscale(d.values[d.values.length-1].value)+delta;
            })
            .attr("y2",function(d){
                return yscale(325)
            })

            //droplines
            var droplines=linechart
            .selectAll("g.dropline")
            .data(function(d){
                return d.values.map(function(p){
                    p.party=d.party;
                    return p;
                })
            })
            droplines.select("circle")
            .attr("cy",function(d){
                return -(yscale(extents.y[0])-yscale(d.value))-padding.bottom-padding.top
            });

            droplines.select("line")
            .attr("y2",function(d){
                return -(yscale(extents.y[0])-yscale(d.value))-padding.bottom-padding.top+3;
            })
            droplines.select("text.seats")
            .text(function(d){
                return d.value
            })

        }
        function createVisuals() {
            var __data=(["cRight","cLeft"]).map(function(d){
                return {
                    party:d,
                    values:data.map(function(p){
                        return {
                            date:p.date,
                            value:p[d]
                        }
                    })
                }
            });

            axes.append("line")
            .attr("class","coalitions-diff")
            .attr("x1",xscale(electionDay))
            .attr("x2",xscale(electionDay))
            .attr("y1",function(d){
                return -yscale(__data[0].values[__data[0].values.length-1].value)-padding.top-padding.bottom
            })
            .attr("y2",function(d){
                return -yscale(__data[1].values[__data[1].values.length-1].value)-padding.top-padding.bottom
            })
            .attr("marker-end","url(#triangle-end)")
            .attr("marker-start","url(#triangle-start)")


            var linechart=linecharts.selectAll("g.linechart")
            .data(__data)
            .enter()
            .append("g")
            .attr("class","linechart")
            .attr("rel",function(d){
                return d.party;
            })
            .attr("transform",function(d){
                if(d.party=="cRight") {
                    return "translate("+(xscale.range()[1]*2)+",0)";
                }
                return "translate(0,0)";
            });
            linechart
            .append("path")
            .attr("class",function(d){
                return "line "+d.party;
            })
            .attr("d",function(d){
                if(d.party=="cRight") {
                    return lineLeft(d.values)
                }
                return lineRight(d.values)
            })


            var txt=linechart
            .append("text")
            .attr("class",function(d){
                return "label "+d.party;
            })
            .attr("x",function(d){
                if(d.party=="cRight") {
                    return -xscale(extents.date[1])-8;
                }
                return xscale(extents.date[1])+8;
            })
            .attr("y",function(d){
                var delta=10,
                    v1=d.values[d.values.length-1].value,
                    v2=d.values[d.values.length-8].value;
                if(v2<v1) {
                    delta=-10;
                }
                return yscale(d.values[d.values.length-1].value)+4;//+delta
            })
            .text(function(d){
                return (d.values[d.values.length-1].value);//+" seats"
            })

            linechart
            .append("line")
            .attr("class",function(d){
                return "line to-election-day "+d.party;
            })
            .attr("x1",function(d){
                var txtElement=txt.node().getBBox(),
                    w=txtElement.width+10;
                if(d.party=="cRight") {
                    return -xscale(extents.date[1])-w;
                }
                return xscale(extents.date[1])+w;
            })
            .attr("y1",function(d){
                return yscale(d.values[d.values.length-1].value)
            })
            .attr("x2",function(d){
                return xscale(electionDay)*(d.party=="cRight"?-1:1);
            })
            .attr("y2",function(d){
                return yscale(d.values[d.values.length-1].value)
            })

            linechart
            .append("circle")
            .attr("class",function(d){
                return "label "+d.party;
            })
            .attr("cx",function(d){
                if(d.party=="cRight") {
                    return -xscale(extents.date[1]);
                }
                return xscale(extents.date[1]);
            })
            .attr("cy",function(d){
                return yscale(d.values[d.values.length-1].value)
            })
            .attr("r",4)
            linechart
            .append("line")
            .attr("class","diff")
            .attr("marker-end","url(#triangle-end)")
            .attr("marker-start","url(#triangle-start)")
            .attr("x1",function(d){
                if(d.party=="cRight") {
                    return -xscale(extents.date[1]);
                }
                return xscale(extents.date[1]);
            })
            .attr("x2",function(d){
                if(d.party=="cRight") {
                    return -xscale(extents.date[1]);
                }
                return xscale(extents.date[1]);
            })
            .attr("y1",function(d){
                return yscale(d.values[d.values.length-1].value)-5
            })
            .attr("y2",function(d){
                return yscale(325)
            })

            var droplines=linechart
            .selectAll("g.dropline")
            .data(function(d){
                return d.values.map(function(p){
                    p.party=d.party;
                    return p;
                })
            })
            .enter()
            .append("g")
            .attr("class","dropline")
            .attr("transform",function(d){
                var x=xscale(d.date)*(d.party=="cRight"?-1:1),
                    y=yscale(extents.y[0])+(padding.bottom+padding.top);
                return "translate("+x+","+y+")"
            })
            .on("mouseover",function(d){
                droplines.classed("hover",function(l){
                    return +l.date == +d.date;
                })
            })
            .on("mouseout",function(d){
                droplines.classed("hover",false);
            });
            droplines.append("circle")
            .attr("class",function(d){
                return d.party;
            })
            .attr("cx",0)
            .attr("cy",function(d){
                return -(yscale(extents.y[0])-yscale(d.value))-padding.bottom-padding.top
            })
            .attr("r",3)
            droplines.append("line")
            .attr("class",function(d){
                return d.party;
            })
            .attr("x1",0)
            .attr("x2",0)
            .attr("y1",-16)
            .attr("y2",function(d){
                return -(yscale(extents.y[0])-yscale(d.value))-padding.bottom-padding.top+3;
            })
            droplines.append("text")
            .attr("class","seats")
            .attr("x",0)
            .attr("y",0)
            .text(function(d){
                return d.value
            })
            droplines.append("text")
            .attr("x",0)
            .attr("y",18)
            .text(function(d){
                return xtickFormat(d.date)
            })
            var ixw=xscale.range()[1]/(data.length-1);
            droplines.append("rect")
            .attr("class","ix")
            .attr("x",-ixw/2)
            .attr("y",function(d){
                return -yscale.range()[0]-padding.top-padding.bottom
            })
            .attr("width",ixw)
            .attr("height",function(d){
                return yscale.range()[0]+padding.top+padding.bottom+margins.bottom
            })

            linechart
            .append("line")
            .attr("class",function(d){
                return "dropline d1 "+d.party;
            })
            .attr("x1",function(d){
                if(d.party=="cRight") {
                    return -xscale(extents.date[1]);
                }
                return xscale(extents.date[1]);
            })
            .attr("y1",function(d){
                return yscale(d.values[d.values.length-1].value)
            })
            .attr("x2",function(d){
                if(d.party=="cRight") {
                    return -xscale(extents.date[1]);
                }
                return xscale(extents.date[1]);
            })
            .attr("y2",function(d){
                return yscale(extents.y[0]);//yscale(d.values[d.values.length-1].value)
            })

            linechart
            .append("line")
            .attr("class",function(d){
                return "dropline d0 "+d.party;
            })
            .attr("x1",function(d){
                if(d.party=="cRight") {
                    return -xscale(extents.date[0]);
                }
                return xscale(extents.date[0]);
            })
            .attr("y1",function(d){
                return yscale(d.values[0].value)
            })
            .attr("x2",function(d){
                if(d.party=="cRight") {
                    return -xscale(extents.date[0]);
                }
                return xscale(extents.date[0]);
            })
            .attr("y2",function(d){
                return yscale(extents.y[0]);//yscale(d.values[d.values.length-1].value)
            })
        }



        var xAxis = d3.svg.axis().scale(xscale).tickValues(function(){
            var last=xscale.domain()[1],
                last_week = new Date(last.getTime());
            last_week.setDate(last_week.getDate() - 7);
            return [
                last,extents.date[1],extents.date[0]
            ]
        });
        var xAxis2 = d3.svg.axis().scale(xscaleLeft).tickValues(function(){
            var last=xscale.domain()[1],
                last_week = new Date(last.getTime());
            last_week.setDate(last_week.getDate() - 7);
            return [
                extents.date[1],extents.date[0]
            ]
        });




        var yAxis = d3.svg.axis()
        .scale(yscale)
        .orient("left")
        .tickValues(yscale.ticks().filter(function(d){
            return (Math.round(d) - d) === 0;
        }));

        var xtickFormat=function(value){

            //console.log("!!!!!!!!!!!",value)

            return d3.time.format("%d/%b")(value)

            var d=d3.time.format("%d")(value),
                m=d3.time.format("%b")(value);

            if(+d===1) {
                return d3.time.format("%b")(value);
            }
            return d3.time.format("%d")(value)
        }
        var ytickFormat=function(d,i){
            var title="";
            //if(i==yAxis.tickValues().length-1) {
            //  title=" SEATS";
            //}
            return d3.format("s")(d)+title;
        }

        xAxis.tickFormat(xtickFormat);
        xAxis2.tickFormat(xtickFormat);
        yAxis.tickFormat(ytickFormat);

        xaxis=axes.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+padding.left+",0)")
        .call(xAxis)
        xaxis.selectAll(".tick")
        .classed("election-day",function(d){
            //console.log(d);
            return +d == +electionDay;
        })

        xaxis2=axes.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+(padding.left+xscale.range()[1])+",0)")
        .call(xAxis2)

        axes.append("line")
        .attr("class","election-day")
        .attr("x1",xscale(electionDay))
        .attr("x2",xscale(electionDay))
        .attr("y1",0)
        .attr("y2",-(HEIGHT-(margins.top+margins.bottom)))
        axes.append("text")
        .attr("class","election-day")
        .attr("x",xscale(electionDay))
        .attr("y",-(HEIGHT-(margins.top+margins.bottom))-5)
        .text("ELECTION DAY")

        majority=xaxis.append("g")
        .attr("class","majority")
        .attr("transform",function(){
            var y=yscale(325)-(HEIGHT-margins.bottom-margins.top);
            return "translate(0,"+y+")";
        })
        majority.append("line")
        .attr("rel","at0")
        .attr("x1",0)
        .attr("y1",0)
        .attr("x2",xscale.range()[1]*2)
        .attr("y2",0)
        //console.log(yscale.range(),yscale(325),yscale.range())


        //.attr("y2",5)
        majority.append("text")
        .attr("x",0)
        .attr("y",-3)
        .text("326 seats to form a majority")

        arrows.append("path")
        .attr("class","arrow")
        .attr("d",function(d){
            var x=xscale(electionDay)+margins.left+padding.left-130,
                y=HEIGHT/2-20;
            return "M"+x+","+y+"l80,40l-80,40z"
        })
        .style("fill","url(#grad_w2g)")

        arrows.append("path")
        .attr("class","arrow")
        .attr("d",function(d){
            var x=xscale(electionDay)+margins.left+padding.left+130,
                y=HEIGHT/2-20;
            return "M"+x+","+y+"l-80,40l80,40z"
        })
        .style("fill","url(#grad_g2w)")

        createVisuals();
        updateVisuals();
        DURATION=1000;

    }

    return CoalitionsMirrorLineChart;
});
