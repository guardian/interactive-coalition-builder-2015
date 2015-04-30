define([
    'd3',
    'coalitionBuilder/updateData',
    'coalitionBuilder/updateView'
], function(
    d3,
    updateData,
    updateView
){
	'use strict';

	function Builder(){

		var DEBUG=true;



        

        var nodes=[];
        var links=[];
        var rscale=d3.scale.sqrt().domain([1,290]).range([20,34])
        var parties=[

            {
                name:"con",
                index:0,
                size:274,
                neutral:[],
                attraction:["libdem","ukip","dup"],
                repulsion:["lab","green","pc"],
                strong_attraction:[],
                strong_repulsion:["snp"],
                pool:false,
                ox:0.3,
                oy:0.7
            },
            {
                name:"lab",
                index:1,
                size:269,
                neutral:[],
                repulsion:["ukip","dup","con"],
                attraction:["snp","libdem","green","pc"],
                strong_attraction:[],
                strong_repulsion:[],
                pool:false,
                ox:0.6,
                oy:0.7
            },
            {
                name:"snp",
                index:2,
                size:55,
                neutral:[],
                repulsion:["dup"],
                attraction:["libdem","green","lab","pc"],
                strong_attraction:["pc"],
                strong_repulsion:["ukip","con"],
                pool:false,
                ox:0.7,
                oy:0.3
            },
            {
                name:"libdem",
                index:3,
                size:27,
                neutral:[],
                repulsion:["ukip","dup"],
                attraction:["con","lab","pc","green","snp"],
                strong_attraction:[],
                strong_repulsion:[],
                pool:false,
                ox:0.5,
                oy:0.3
            },
            {
                name:"ukip",
                index:4,
                size:3,
                neutral:[],
                repulsion:["pc","lab","libdem"],
                attraction:["dup","con"],
                strong_attraction:[],
                strong_repulsion:["snp","green"],
                pool:false,
                ox:0.2,
                oy:0.2
            },
            {
                name:"green",
                index:5,
                size:1,
                neutral:[],
                repulsion:["dup","con"],
                attraction:["pc","lab","libdem"],
                strong_attraction:[],
                strong_repulsion:["ukip"],
                pool:false,
                ox:0.8,
                oy:0.7
            },
            {
                name:"pc",
                index:6,
                size:3,
                neutral:[],
                repulsion:["dup","con","ukip"],
                attraction:["pc","ld","green"],
                strong_attraction:["snp"],
                strong_repulsion:["ukip"],
                pool:false,
                ox:0.1,
                oy:0.6
            },
            {
                name:"dup",
                index:7,
                size:9,
                neutral:[],
                repulsion:["lab","snp","green","libdem"],
                attraction:["con","dup"],
                strong_attraction:["snp"],
                strong_repulsion:["ukip"],
                pool:false,
                ox:0.9,
                oy:0.5
            }

        ];

        
        
        var dragged = null,
            selected = null,
            dragged_node = null;

        var coalitions=d3.select("#coalitions")
            .on("mousemove", mousemove)
            .on("mouseup", mouseup)
            .on("touchmove", mousemove)
            .on("touchend", mouseup)

        var bbox=coalitions.node().getBoundingClientRect(),
        	width = bbox.width,
            height = 320;

        d3.select("#parties")
            .selectAll("div.node")
            .data(parties)
            .enter()
                .append("div")
                .attr("class","node")
                    .style("left",function(d){
                        return (d.ox * width) + "px";
                    })
                    .style("top",function(d){
                        return (d.oy * height/2) + "px";
                    })
                    .on("mousedown", function(d) { dragged_node=this; dragged = d; mousedown();})
                    .on("touchstart",function(d) { dragged_node=this; dragged = d; mousedown();})
                    .append("div")
                        .attr("class",function(d){
                            return "party "+d.name;
                        })
                        .style("width", function(d){return (rscale(d.size)*2)+"px";})
                        .style("height", function(d){return (rscale(d.size)*2)+"px";})
                        .style("margin-left", function(d){return -(rscale(d.size))+"px";})
                        .style("margin-top", function(d){return -(rscale(d.size))+"px";})
                        .style("border-radius",function(d){return (rscale(d.size)*2)+"px";})

        var dom_parties={};
        d3.select("#parties")
            .selectAll("div.node")
                .select("div.party")
                    .each(function(d){
                        //console.log("----->",this);
                        dom_parties[d.name]=this;
                    })

        function redraw() {
            
            
            d3.select("#parties")
                .selectAll("div.node")
                    .filter(function(d){
                        return d == dragged
                    })
                    .style("left",function(d){
                        return d.x+"px"
                    })
                    .style("top",function(d){
                        return (d.y)+"px"
                    })

            /*circle
                .classed("selected", function(d) { return d === selected; })
                .attr("cx", function(d) { return d[0]; })
                .attr("cy", function(d) { return d[1]; });
            */
            if (d3.event) {
                d3.event.preventDefault();
                d3.event.stopPropagation();
            }
        }
        function mousedown() {
            var m = d3.mouse(coalitions.node());
            dragged.x = m[0];
            dragged.y = m[1];
            
            redraw();
        }

        function mousemove() {
            if (!dragged) return;
            var m = d3.mouse(coalitions.node());
            dragged.x = m[0];//Math.max(0, Math.min(width, m[0]));
            dragged.y = m[1];//Math.max(0, Math.min(height, m[1]));

            //updateData.setActive(dragged.name);
            //updateData.setSum();
        	//updateView.sum(updateData.getSum());

            redraw();
        }

        function mouseup() {
            if (!dragged) return;
            mousemove();
            
            //console.log(dragged);
            //console.log("END",d3.event.x,d3.event.y)

            node.style("opacity",1);
            
            var party, isActive;
            if(dragged.y>160) {
                //console.log("START THE MESS!!!!");
                d3.select(dragged_node).classed("hidden",true)
                addParty(dragged.name,dragged.x,dragged.y-160);

                isActive = true;
            }
            if(dragged.y<160) {
                //console.log("REMOVE FROM THE MESS!!!!");
                removeParty(dragged.name);

                isActive = false;

                d3.select(dragged_node)
                    .transition()
                    .duration(500)
                        .style("left",function(d){
                            return (d.ox * width) + "px";
                        })
                        .style("top",function(d){
                            return (d.oy * height/2) + "px";
                        })
            }
           
            party = dragged.name;

            //TODO: remove hotfix
            switch(party) {
                case "libdem": party = "ld";  break;
                case "green":  party = "grn"; break;
            }

            updateData.setActive(party, isActive);
            updateData.setSum();
            
            updateView.sum();
            updateView.analysis(party, isActive);
            updateView.animation(party, isActive);

            dragged = null;
            dragged_node = null;
        }
        

        /*d3.select("ul").selectAll("li")
                .data(parties)
                    .enter()
                    .append("li")
                        .append("a")
                            .attr("href","#")
                            .text(function(d){
                                return d.name;
                            })
                            .on("click",function(d){
                                d3.event.preventDefault();
                                addParty(d.name);
                            })*/
        
        var distance={
            neutral:100,
            repulsion:200,
            attraction:110,
            strong_repulsion:220,
            strong_attraction:90
        }
        var distances={}

        parties.forEach(function(p){
            p.neutral.forEach(function(d){
                distances[p.name+"-"+d]=distance.neutral;
                distances[d+"-"+p.name]=distance.neutral;
            })
            p.repulsion.forEach(function(d){
                distances[p.name+"-"+d]=distance.repulsion;
                distances[d+"-"+p.name]=distance.repulsion;
            })
            p.attraction.forEach(function(d){
                distances[p.name+"-"+d]=distance.attraction;
                distances[d+"-"+p.name]=distance.attraction;
            })
            p.strong_repulsion.forEach(function(d){
                distances[p.name+"-"+d]=distance.strong_repulsion;
                distances[d+"-"+p.name]=distance.strong_repulsion;
            })
            p.strong_attraction.forEach(function(d){
                distances[p.name+"-"+d]=distance.strong_attraction;
                distances[d+"-"+p.name]=distance.strong_attraction;
            })
        })
        
        //console.log(distances);
        

        /*
        parties.map(function(d,i){
            return d;
        }).filter(function(d){
            return d.pool;
        }).forEach(function(d,i){
            nodes.push({
                index:d.index,
                name:d.name,
                id:d.name,
                x:Math.floor(Math.random() * width),
                y:0,//Math.floor(Math.random() * height),
                r:rscale(d.size)
            })
        });
        console.log(nodes);
        
        for(var i=0;i<nodes.length;i++) {
            for(var j=i+1;j<nodes.length;j++) {
                console.log(i,j)
                links.push({
                    source:parties[i],
                    target:parties[j]
                })
            }
        }
        */
        //console.log(links)
        
        var force = d3.layout.force()
                        .size([width, height])
                        .nodes(nodes)
                        .links(links)

        force.gravity(0.1);

        //force.charge(-120)

        force.linkStrength(function(d){
            //console.log("s",d);
            return 1;//d.strength;
        })
        force.linkDistance(function(d){
            //console.log(d.source.name+"-"+d.target.name,distances[d.source.name+"-"+d.target.name]);
            return distances[d.source.name+"-"+d.target.name]
        })

        //force.charge(-20)
        if(DEBUG) {


        var svg = d3.select("#builder").append("svg")
                .attr("width", width)
                .attr("height", height);

            svg.append("line")
                    .attr("class","axis")
                    .attr("x1",width/2)
                    .attr("x2",width/2)
                    .attr("y1",0)
                    .attr("y2",height)
            svg.append("line")
                    .attr("class","axis")
                    .attr("x1",0)
                    .attr("x2",width)
                    .attr("y1",height/2)
                    .attr("y2",height/2)

            var svg_link = svg.selectAll('.link');
            //var svg_node = svg.selectAll(".node");
        }

        var builder=d3.select("#builder").append("div").attr("class","builder");

        var node = builder.selectAll(".node");

        var dragging=null;

        /*builder.on("mousemove",function(d){
            if(dragging) {
                var coords=d3.mouse(this);
                d3.select(dragging)
                        .style({
                            left:coords[0]+"px",
                            top:(coords[1]+160)+"px"
                        })
            }
        })*/


        /*force.on("end",function(){

            node
                .style("left", function(d) { return d.x+"px"; })
                .style("top", function(d) { return d.y+"px"; })

            if(DEBUG) {
                svg_node
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
                    

                svg_link.attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });
            }


        })*/

        force.on('tick',tick);

        start();

        function tick(e) {
            
            node
                .style("left", function(d) { return d.x+"px"; })
                .style("top", function(d) { return d.y+"px"; })

            //console.log(node)
            if(DEBUG) {
                //svg_node.attr("cx", function(d) { return d.x; })
                //    .attr("cy", function(d) { return d.y; });

                svg_link.attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });
            }
        }

        

        function start() {
            
            node = node.data(force.nodes(), function(d) { return d.id; });
            
            var nodes_flat=[];

            force.nodes().forEach(function(d){
                nodes_flat.push(d.id)
            })
            
            function nodeMouseDown(d){
                //console.log(d)

                //console.log(d3.select(dom_parties[d.id]))
                //dragging=dom_parties[d.id].parentNode
                dragged_node=dom_parties[d.id].parentNode;
                dragged=d3.select(dom_parties[d.id]).datum();

                d3.select(dragged_node).classed("hidden",false)

                dragged.x=d.x;
                dragged.y=d.y+160;

                redraw();
                
                
            }

            node.enter()
                .append("div")
                .on("mousedown",function(d){
                    nodeMouseDown(d);
                    d3.select(this).style("opacity",0.5);
                })
                .on("touchstart",function(d){
                    nodeMouseDown(d);
                    d3.select(this).style("opacity",0.5);
                })
                .attr("class", "node")
                    .append("div")
                        .attr("class",function(d){
                            return "party "+d.id;
                        })
                        .style("width", function(d){return (d.r*2)+"px";})
                        .style("height", function(d){return (d.r*2)+"px";})
                        .style("margin-left", function(d){return -(d.r)+"px";})
                        .style("margin-top", function(d){return -(d.r)+"px";})
                        .style("border-radius",function(d){return (d.r*2)+"px";});

            /*.append(function(d){
                        return dom_parties[d.id];
                    })*/

            node.exit().remove();

            node.classed("angry",function(d){
                var status=false;
                //console.log("checking angry",d,nodes_flat)
                var party=arrayFind(parties,function(p){
                    //console.log("check",p,d)
                    return p.name == d.name;
                });
                //console.log("party",party)
                status=nodes_flat.some(function(d){
                    return (party.repulsion.indexOf(d)>-1 || party.strong_repulsion.indexOf(d)>-1);
                });
                //console.log("status",status)

                return status;
            })

            node.classed("happy",function(d){
                var status=false;
                //console.log("checking happy",d,nodes_flat)
                var party=arrayFind(parties,function(p){
                    //console.log("check",p,d)
                    return p.name == d.name;
                });
                //console.log("party",party)
                status=nodes_flat.some(function(d){
                    return (party.attraction.indexOf(d)>-1 || party.strong_attraction.indexOf(d)>-1);
                });
                //console.log("status",status)

                return status;
            })

            if(DEBUG) {
                svg_link = svg_link.data(force.links(),function(d){
                    //console.log("LINKS DATA",d,d.source.id+"-"+d.target.id)
                    return d.source.id+"-"+d.target.id;
                });
                svg_link.enter().append("line", ".node").attr("class", "link");
                svg_link.exit().remove();

                /*svg_node = svg_node.data(force.nodes());
                
                svg_node.enter().append("circle").attr("class", function(d) { 
                    console.log("adding node",d)
                    return "node " + d.id; 
                }).attr("r", function(d){return d.r;});

                svg_node.exit().remove();*/
            }
            force.start();
        }
        function removeParty(partyName) {
            //console.log("removeParty",partyName)
            //if(!party) {
            var party=arrayFind(parties,function(p){
                //console.log(p.name,"==",partyName)
                return p.name == partyName;
            });
            //}

            party.pool=false;

            //console.log("!!!!!!!!!!",party)

            
            nodes=nodes.filter(function(d){
                //console.log(d.id,"!=",party.name)
                return d.id!=party.name;
            })

            force.nodes(nodes)
            //console.log("AFTER REMOVING",nodes,force.nodes())
            //console.log("LINKS",links);

            links=links.filter(function(d){
                //console.log("AAAHHHHH",d)
                return d.target.id!=partyName && d.source.id!=partyName;
            })
            force.links(links)
            //console.log("REMOVE LINKS",links,force.links());

            start();

        }
        function addParty(partyName,x,y) {
            var party=arrayFind(parties,function(p){
                return p.name == partyName;
            });
            if(party.pool) {
                //console.log("already in")
                //removeParty(partyName,party);
                return;
            }
            party.pool=true;

            nodes.push({
                //index:nodes.length,
                name:party.name,
                id:party.name,
                x: x || Math.floor(Math.random() * width),
                y: y || 0,//Math.floor(Math.random() * height),
                r:rscale(party.size)
            });
            //console.log("adding",party[0])
            //force.nodes(nodes)
            //console.log(nodes);
            //links=[];
            for(var i=0;i<nodes.length;i++) {
                for(var j=i+1;j<nodes.length;j++) {
                    //console.log("adding link",i,j)
                    var __link={
                        source:nodes[i],
                        target:nodes[j]
                    };
                    if(!arrayFind(links,function(d){ return d.source.id==__link.source.id && d.target.id==__link.target.id})) {
                        links.push(__link);
                    }
                }
            }

            //console.log("ADD LINKS",links)

            start();
        }   
        
        /*removeNode = function (id) {
            var i = 0;
            var n = findNode(id);
            while (i < links.length) {
                if ((links[i]['source'] === n)||(links[i]['target'] == n)) links.splice(i,1);
                else i++;
            }
            var index = findNodeIndex(id);
            if(index !== undefined) {
                nodes.splice(index, 1);
                update();
            }
        }*/
        function arrayFind(array,predicate){
            var values=array.filter(predicate);
            //console.log("VALUES",values)
            if(!values.length) {
                return null;
            }
            return values[0];
        }
        function arrayFind2(array,predicate) {
            if (array == null) {
              throw new TypeError('arrayFind called on null or undefined');
            }
            if (typeof predicate !== 'function') {
              throw new TypeError('predicate must be a function');
            }
            var list = Object(array);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
              value = list[i];
              if (predicate.call(thisArg, value, i, list)) {
                return value;
              }
            }
            return undefined;
        }

	}

	return Builder;

})
