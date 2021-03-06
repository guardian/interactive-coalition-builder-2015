define([
    'd3',
    'app/updateData',
    'app/updateView',
    'common/utilities',
    'app/Coalition'
], function(
    d3,
    updateData,
    updateView,
    utilities,
    yourCoalition
){
    'use strict';

    function Builder(options){

        var DEBUG=false;

        //console.log("v0.6")
        //console.log(options)

        var nodes=[];
        var links=[];
        var nodes_flat=[];

        var maxRadius=60,
            padding=2;
        var radiuses={
            mobile:[28,40],
            restoftheworld:[32,60]
        }
        var rscale=d3.scale.sqrt()
                .domain([1,d3.max(options.data,function(d){return d.seat;})]);

        var attractionTable={
            "con":{
                vname:"Con",
                ox:0.35,
                oy:0.61,
                active:true
            },
            "lab":{
                vname:"Lab",
                ox:0.62,
                oy:0.61,
                active:true
            },
            "snp":{
                vname:"SNP",
                ox:0.73,
                oy:0.215
            },
            "libdem":{
                vname:"LD",
                ox:0.5,
                oy:0.2
            },
            "ukip":{
                vname:"Ukip",
                ox:0.165,
                oy:0.18
            },
            "green":{
                vname:"Green",
                ox:0.8,
                oy:0.76
            },
            "pc":{
                vname:"PC",
                ox:0.9,
                oy:0.165
            },
            "dup":{
                vname:"DUP",
                ox:0.1,
                oy:0.6
            },
            "sdlp":{
                vname:"SDLP",
                ox:0.9,
                oy:0.55
            }
        };
        //console.log(options.active)
        options.active.forEach(function(p){
            attractionTable[p].default=true;
        });

        var parties=[];

        options.data.forEach(function(d){


            var party=attractionTable[d.party];
            if(party) {
                //console.log(party,d)
                party.name=d.party;
                party.size=d.seat;
                party.repulsion=d.repulsion;
                party.attraction=d.attraction;
                party.strong_attraction=d.strong_attraction;
                party.strong_repulsion=d.strong_repulsion;
                party.neutral=d.neutral;

                parties.push(party)

            }
        });  

        //console.log("attractionTable",attractionTable)

        
        var dragged = null,
            selected = null,
            dragged_node = null;

        var coalitions=d3.select("#coalitions")
            .on("mousemove", mousemove)
            .on("mouseup", mouseup)
            .on("touchmove", mousemove)
            .on("touchend", mouseup)
            .style("height",function(d){
                var size=utilities.getWindowSize();
                var h=Math.max(480,size.height-80);

                return h+"px";
            });


            
       

        var playground=d3.select(options.playground || "#playground");
        var bbox_playground=playground.node().getBoundingClientRect(),
            width_pg = bbox_playground.width,
            height_pg = bbox_playground.height,
            width=width_pg,
            height=height_pg;

        if(width<480) {
            rscale.range(radiuses.mobile);   
        } else {
            rscale.range(radiuses.restoftheworld);
        }
        


        var bench=d3.select(options.bench || "#bench").classed("show-active",true)
        var bbox_bench=bench.node().getBoundingClientRect(),
            width_bn = bbox_bench.width,
            height_bn = bbox_bench.height;

        var bubble=d3.select("#bench")
            .selectAll("div.node")
            .data(parties)
            .enter()
                .append("div")
                .attr("class","node")
                    .classed("blurred",function(d){
                        //console.log("blurred",d)
                        return !d.active;
                    })
                    .style("left",function(d){
                        return (width_bn/2) + "px";
                    })
                    .style("top",function(d){
                        return (height_bn/2)+"px";
                    })
                    .on("mousedown", function(d) { 
                        if(!d.active) {
                            return;
                        }
                        dragged_node=this;
                        dragged = d;
                        mousedown();
                    })
                    .on("touchstart",function(d) { 
                        if(!d.active) {
                            return;
                        }
                        dragged_node=this;
                        dragged = d;
                        mousedown();
                    });

        var bubble_inset=bubble
                    .append("div")
                        .attr("class",function(d){
                            return "party "+d.name;
                        })
                        .style("width", function(d){return (rscale(d.size)*2)+"px";})
                        .style("height", function(d){return (rscale(d.size)*2)+"px";})
                        .style("margin-left", function(d){return -(rscale(d.size))+"px";})
                        .style("margin-top", function(d){return -(rscale(d.size))+"px";})

        var face=bubble_inset.append("div")
                        .attr("class","face")
                        .style("border-radius",function(d){return (rscale(d.size)*2)+"px";})

        face
            .append("div")
                .attr("class","pic")
                .style("border-radius",function(d){return (rscale(d.size)*2)+"px";});
        face
            .append("div")
                .attr("class","overlay")
                .style("border-radius",function(d){return (rscale(d.size)*2)+"px";});

        /*bubble_inset
                .append("h3")
                    .text(function(d){return d.vname;});
        */
        var text = bubble_inset.append("p").attr("class","caption");
        text.append("span")
            .attr("class", "f-p-bb")    
            .text(function(d){ return d.vname; });
        text.append("span")
            .text(function(d){ return " " + d.size; });


        var dom_parties={};
        d3.select("#bench")
            .selectAll("div.node")
                .select("div.party")
                    .each(function(d){
                        //console.log("----->",this);
                        dom_parties[d.name]=this;
                    });

        function update() {

            coalitions.style("height",function(d){
                var size=utilities.getWindowSize();
                return Math.max(600,size.height-80)+"px";
            })

            bbox_playground=playground.node().getBoundingClientRect();
            width_pg = bbox_playground.width;
            height_pg = bbox_playground.height;
            var mobile_bp=480;
            var changing_radius=(width>mobile_bp && width_pg<mobile_bp || width<mobile_bp && width_pg>mobile_bp);

            width=width_pg;
            height=height_pg;

            bbox_bench=bench.node().getBoundingClientRect();
            width_bn = bbox_bench.width;
            height_bn = bbox_bench.height;

            if(changing_radius) {
                if(width<mobile_bp) {
                    rscale.range(radiuses.mobile);   
                } else {
                    rscale.range(radiuses.restoftheworld);
                }

                nodes.forEach(function(n){
                    n.r=rscale(n.size);
                });
                
            }

            updateBench(changing_radius);

            force.size([width_pg, height_pg]);
            force.start();
            
        }
        
        function updateBench(changing_radius) {
            //console.log("updateBench")
            var bubble=d3.select("#bench")
                .selectAll("div.node")
                    .transition()
                    .duration(500)
                        .style("left",function(d){
                            d.bx=(d.ox * width_bn);
                            return d.bx + "px";
                        })
                        .style("top",function(d){
                            d.by=(d.oy * height_bn);
                            return d.by + "px";
                        });

            if(changing_radius) {
                var bubble_inset=bubble
                            .select("div.party")
                                .style("width", function(d){return (rscale(d.size)*2)+"px";})
                                .style("height", function(d){return (rscale(d.size)*2)+"px";})
                                .style("margin-left", function(d){return -(rscale(d.size))+"px";})
                                .style("margin-top", function(d){return -(rscale(d.size))+"px";})

                var face=bubble_inset.select("div.face")
                                .style("border-radius",function(d){return (rscale(d.size)*2)+"px";})

                face
                    .select("div.pic")
                        .style("border-radius",function(d){return (rscale(d.size)*2)+"px";});
                face
                    .select("div.overlay")
                        .style("border-radius",function(d){return (rscale(d.size)*2)+"px";});
            }
        }
        updateBench();
        var to=null;
        window.addEventListener("resize",function(d){
            if(to) {
                clearTimeout(to);
                to=null;
            }
            to=setTimeout(update,200);
        })

        function redraw() {
            
            
            d3.select("#bench")
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

            if (d3.event) {
                d3.event.preventDefault();
                d3.event.stopPropagation();
            }
        }
        function mousedown() {
            var m = d3.mouse(coalitions.node());
            
            dragged.dx=m[0]-(dragged.x || dragged.bx);
            dragged.dy=m[1]-(dragged.y || dragged.by);

            dragged.x = m[0]-(dragged.dx);
            dragged.y = m[1]-(dragged.dy);
            
            

            d3.select("#bench")
                    .selectAll("div.node")
                        .filter(function(d){
                            return d.name == dragged.name
                        })
                        .classed("dragging",true)

            redraw();
        }

        function mousemove() {
            if (!dragged) return;
            var m = d3.mouse(coalitions.node());

            //console.log("mousemove",m,dragged.x,dragged.dx)

            dragged.x = m[0]-(dragged.dx);
            dragged.y = m[1]-(dragged.dy);

            var isActive;
            if(dragged.y>height_bn) {
                updateData.setActive(dragged.name);
                isActive=true;
                
            } else {
                isActive=false;
            }
            var party = dragged.name;
            updateData.setActive(party, isActive);
            updateData.setSum();

            updateView.sum();
            
            
            
            playground.classed("dropping",function(d){
                return dragged.y>height_bn;
            })

            redraw();
        }

        function activateBench() {
            bench.classed("show-active",false);
            
            d3.select("#bench")
                .selectAll("div.node")
                    .classed("dragging",false)
                    .classed("blurred",false)
                    .each(function(d){
                        d.active=true;
                    });
        }

        function mouseup() {
            if (!dragged) return;
            //console.log("mouseup")
            mousemove();
            
            //console.log(dragged);
            //console.log("END",d3.event.x,d3.event.y)

            
            node.classed("blurred",false);
            playground.classed("dropping",false);
            
            activateBench();
            
            var party, isActive;
            if(dragged.y>height_bn) {
                
                isActive = true;

                party = dragged.name;
                updateData.setActive(party, isActive);
                updateData.setSum();
                updateView.sum();

                //TODO: improve speed on mouseup
                //setTimeout(function(){
                    updateView.analysis(party, isActive);
                //},1000);

                if(!dragged.pool) {

                    addParty(dragged.name,dragged.x,dragged.y - height_bn);
                    d3.select(dragged_node).classed("hidden",true).classed("dragging",false);
                } else {

                    var __node=node.data().find(function(d){
                        return d.name==dragged.name
                    });

                    d3.select(dragged_node)//.classed("hidden",true)
                        .transition()
                        .duration(500)
                            .style("left",function(d){
                                return (__node.x) + "px";
                            })
                            .style("top",function(d){
                                //console.log("going to",(__node.y+height_bn))
                                return (__node.y+height_bn) + "px";
                            })
                            //.style("opacity",0)
                            .each("end",function(){
                                d3.select(this).classed("hidden",true)
                            })
                            

                }
                

                
            }
            if(dragged.y<height_bn) {
                    
                party = dragged.name;
                isActive = false;

                updateData.setActive(party, isActive);
                updateData.setSum();
                updateView.sum();

                //TODO: improve speed on mouseup
                //setTimeout(function(){
                    updateView.analysis(party, isActive);
                //},1000);

                removeParty(dragged.name);

                

                dragged.x=null;
                dragged.y=null;

                d3.select(dragged_node)
                    .transition()
                    .duration(500)
                        .style("left",function(d){
                            d.bx=(d.ox * width_bn);
                            return d.bx + "px";
                        })
                        .style("top",function(d){
                            d.by=(d.oy * height_bn);
                            return d.by + "px";
                        });

                d3.select("#bench")
                    .selectAll("div.node")
                        .filter(function(d){
                            return !d.pool;
                        })
                        .classed("happy",false)
                        .classed("angry",false);
            }
            
            /*
            party = dragged.name;
            updateData.setActive(party, isActive);
            updateData.setSum();
            updateView.sum();

            //TODO: improve speed on mouseup
            //setTimeout(function(){
                updateView.analysis(party, isActive);
            //},1000);
            */

            dragged = null;
            dragged_node = null;

            setPlaygroundStatus();
        }
        this.reset=function() {
            reset();
        }
        function reset() {

            var current_nodes=d3.select("#bench")
                                .selectAll("div.node").data();

            force.nodes().forEach(function(d){
                var node=current_nodes.find(function(n){
                    //console.log(d,n);
                    return n.name==d.name;
                });
                node.cx=d.x;
                node.cy=d.y+height_bn;
                //console.log("!",node)
            });
            nodes=[];
            links=[];
            force.nodes(nodes);
            force.links(links);
            start();

            utilities.updateURL([])

            d3.select("#bench")
                .selectAll("div.node")
                    .filter(function(d){
                        return d.pool;
                    })
                        .style("left",function(d){
                            return d.cx + "px";
                        })
                        .style("top",function(d){
                            return d.cy + "px";
                        })
                        .classed("neutral",false)
                        .classed("happy",false)
                        .classed("angry",false)

            d3.select("#bench")
                .selectAll("div.node")
                    .classed("hidden",false)
                        .each(function(d){
                            d.pool=false;
                        })
                        .transition()
                        .duration(500)
                            .style("left",function(d){
                                d.x=null;
                                d.bx=(d.ox * width_bn);
                                return d.bx + "px";
                            })
                            .style("top",function(d){
                                d.y=null;
                                d.by=(d.oy * height_bn);
                                return d.by + "px";
                            });

            dragged = null;
            dragged_node = null;

            setPlaygroundStatus();

            // reset data and view
            updateData.setActiveAll(false);
            updateData.setSum();

            updateView.reset();


        }

        function setPlaygroundStatus() {
            playground.classed("active",parties.some(function(p){
                    return p.pool===true;;
                })
            );
        }

        var distances={}
        var factor=1;
        parties.forEach(function(p){
            p.neutral.forEach(function(party_name){
                var party=parties.find(function(d){
                    return d.name==party_name;
                }),
                    //dist=(rscale(Math.max(p.size,party.size))*1.1)
                    dist=(rscale(p.size)+rscale(party.size)*1.2);
                dist=d3.max([dist,rscale(p.size)+rscale(party.size)]);
                distances[p.name+"-"+party.name]=dist;
                distances[party.name+"-"+p.name]=dist;
                //distances[p.name+"-"+party.name]=(rscale(p.size)*factor+rscale(party.size)*factor)*distance.attraction;
                //distances[party.name+"-"+p.name]=(rscale(p.size)*factor+rscale(party.size)*factor)*distance.attraction;
            })
            p.repulsion.forEach(function(party_name){
                var party=parties.find(function(d){
                    return d.name==party_name;
                }),
                    //dist=(rscale(Math.max(p.size,party.size))*4);
                    dist=(width*0.5);

                dist=d3.max([dist,rscale(p.size)+rscale(party.size)]);
                distances[p.name+"-"+party.name]=dist;
                distances[party.name+"-"+p.name]=dist;
                //distances[p.name+"-"+party.name]=(rscale(p.size)*factor+rscale(party.size)*factor)*distance.repulsion;
                //distances[party.name+"-"+p.name]=(rscale(p.size)*factor+rscale(party.size)*factor)*distance.repulsion;
            })
            p.attraction.forEach(function(party_name){
                var party=parties.find(function(d){
                    return d.name==party_name;
                }),
                    //dist=(rscale(Math.max(p.size,party.size))*1.1)
                    dist=(rscale(p.size)+rscale(party.size)*1.2);
                dist=d3.max([dist,rscale(p.size)+rscale(party.size)]);
                distances[p.name+"-"+party.name]=dist;
                distances[party.name+"-"+p.name]=dist;
                //distances[p.name+"-"+party.name]=(rscale(p.size)*factor+rscale(party.size)*factor)*distance.attraction;
                //distances[party.name+"-"+p.name]=(rscale(p.size)*factor+rscale(party.size)*factor)*distance.attraction;
            })
            p.strong_repulsion.forEach(function(party_name){
                var party=parties.find(function(d){
                    return d.name==party_name;
                }),
                    //dist=(rscale(Math.max(p.size,party.size))*3);
                    dist=(rscale(p.size)+rscale(party.size))*6;
                dist=Math.min(width*0.75,height*0.75);
                dist=d3.max([dist,rscale(p.size)+rscale(party.size)]);
                distances[p.name+"-"+party.name]=dist;
                distances[party.name+"-"+p.name]=dist;
                //distances[p.name+"-"+party.name]=(rscale(p.size)*factor+rscale(party.size)*factor)*distance.strong_repulsion;
                //distances[party.name+"-"+p.name]=(rscale(p.size)*factor+rscale(party.size)*factor)*distance.strong_repulsion;
                
            })
            p.strong_attraction.forEach(function(party_name){
                var party=parties.find(function(d){
                    return d.name==party_name;
                }),
                    //dist=(rscale(Math.max(p.size,party.size))*0.8);
                    dist=(rscale(p.size)+rscale(party.size))*1.1;
                //distances[p.name+"-"+party.name]=(rscale(p.size)*factor+rscale(party.size)*factor)*distance.strong_attraction;
                //distances[party.name+"-"+p.name]=(rscale(p.size)*factor+rscale(party.size)*factor)*distance.strong_attraction;
                dist=d3.max([dist,rscale(p.size)+rscale(party.size)]);
                distances[p.name+"-"+party.name]=dist;
                distances[party.name+"-"+p.name]=dist;
            })
        });
        
        //console.log(distances);
        
        var force = d3.layout.force()
                        .size([width_pg, height_pg])
                        .nodes(nodes)
                        .links(links)

        //force.gravity(0.1);
        force.charge(0)
        force.friction(0.7)
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


        var svg = d3.select("#playground").append("svg")
                .attr("width", width_pg)
                .attr("height", height_pg);

            svg.append("line")
                    .attr("class","axis")
                    .attr("x1",width_pg/2)
                    .attr("x2",width_pg/2)
                    .attr("y1",0)
                    .attr("y2",height_pg)
            svg.append("line")
                    .attr("class","axis")
                    .attr("x1",0)
                    .attr("x2",width_pg)
                    .attr("y1",height_pg/2)
                    .attr("y2",height_pg/2)

            var svg_link = svg.selectAll('.link');
            //var svg_node = svg.selectAll(".node");
        }

        var builder=d3.select("#playground").append("div").attr("class","builder");

        var node = builder.selectAll(".node");

        var dragging=null;

        force.on('tick',tick);

        start();

        ;(function initialize() {
            //console.log("initialize");
            
            if(options.active.length) {
                activateBench();

                nodes_flat=force.nodes().map(function(d){
                    return d.id;
                });     

                parties.forEach(function(party){
                    if(party.default) {
                        
                        
                        
                        d3.selectAll("#bench .node").filter(function(d){
                            return d.name == party.name;
                        }).classed("hidden",true).classed("dragging",false);        
                        
                        updateData.setActive(party.name, true);
                        updateData.setSum(); //TODO: quick fix!!!
                        updateView.analysis(party.name, true);

                        addParty(party.name,width*party.ox,height_pg*party.oy,true);
                        
                    }                
                });

                
                updateData.setSum();
                updateView.sum();

                

                setPlaygroundStatus();

                start();
            }  
            

        }());

        function tick(e) {
            
            node
                .each(collide(0.75))
                .style("display","block")
                .style("left", function(d) { 
                    var delta=2;
                    d.x=Math.max(d.r+delta, Math.min(width - (d.r+delta), d.x))
                    return d.x+"px"; 
                })
                .style("top", function(d) { 
                    var delta=5;
                    d.y=Math.max(d.r+delta, Math.min(height - (d.r+delta), d.y))
                    return d.y+"px"; 
                })

            /*node.style("left", function(d) { return d.x = Math.max(d.r, Math.min(width - d.r, d.x))+"px"; })
                .style("top", function(d) { return d.y = Math.max(d.r, Math.min(height - d.r, d.y))+"px"; });*/

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
        
        function getAngry(d) {
            var status=false;
            var party=parties.find(function(p){
                return p.name == d.name;
            });
            status=nodes_flat.some(function(p){
                //console.log(p,party.repulsion)
                return (party.repulsion.indexOf(p)>-1 || party.strong_repulsion.indexOf(p)>-1);
            });
            
            return status;
        }
        function getHappy(d) {
            var status=false;
            var party=parties.find(function(p){
                return p.name == d.name;
            });
            status=nodes_flat.some(function(d){
                return (party.attraction.indexOf(d)>-1 || party.strong_attraction.indexOf(d)>-1);
            });

            return status;
        }
        function getNeutral(d) {
            var status=false;
            var party=parties.find(function(p){
                return p.name == d.name;
            });
            status=nodes_flat.some(function(d){
                return (party.neutral.indexOf(d)>-1);
            });

            return status;
        }

        function start() {
            
            node = node.data(force.nodes(), function(d) { return d.id; });
            
            nodes_flat=force.nodes().map(function(d){
                return d.id;
            });
            
            function nodeMouseDown(d,coords){
                //console.log("coords",coords)

                dragged_node=dom_parties[d.id].parentNode;
                dragged=d3.select(dom_parties[d.id]).datum();

                d3.select(dragged_node).classed("hidden",false)
                                
                dragged.x=d.x;
                dragged.y=d.y+height_bn;
                
                dragged.dx=coords[0];
                dragged.dy=coords[1];

                d3.select("#bench")
                    .selectAll("div.node")
                        .filter(function(d){
                            //console.log(d.name,"==",dragged.name)
                            return d.name == dragged.name
                        })
                        .classed("dragging",true)

                redraw();
                
            }

            var __node=node.enter()
                .append("div")
                    .style("display","none")
                    .on("mousedown",function(d){
                        nodeMouseDown(d,d3.mouse(this));
                        d3.select(this).classed("blurred",true);
                    })
                    .on("touchstart",function(d){
                        
                        nodeMouseDown(d,d3.touches(this)[0]);
                        d3.select(this).classed("blurred",true);
                    })
                    .attr("class", "node");
            /*node
                .sort(function(a,b){
                    return b.size - a.size;    
                })
                .each(function(d){
                    d3.select(this).moveToFront();
                })*/

            var bubble_inset=__node
                        .append("div")
                            .attr("class",function(d){
                                return "party "+d.name;
                            })
                            .style("width", function(d){return (rscale(d.size)*2)+"px";})
                            .style("height", function(d){return (rscale(d.size)*2)+"px";})
                            .style("margin-left", function(d){return -(rscale(d.size))+"px";})
                            .style("margin-top", function(d){return -(rscale(d.size))+"px";})

            var face=bubble_inset.append("div")
                        .attr("class","face")
                        .style("border-radius",function(d){return (rscale(d.size)*2)+"px";})

            face
                .append("div")
                    .attr("class","pic")
                    .style("border-radius",function(d){return (rscale(d.size)*2)+"px";});
            face
                .append("div")
                    .attr("class","overlay")
                    .style("border-radius",function(d){return (rscale(d.size)*2)+"px";});

            /*bubble_inset
                    .append("h3")
                        .text(function(d){return d.vname;});
            */
            var text = bubble_inset.append("p").attr("class","caption");
            text.append("span")
                .attr("class", "f-p-bb")    
                .text(function(d){ return d.vname; });
            text.append("span")
                .text(function(d){ return " " + d.size; });


            node.exit().remove();

            node
                .classed("angry",function(d){
                    return getAngry(d);
                })
                .classed("happy",function(d){
                    return getHappy(d);
                })
                .classed("neutral",function(d){
                    return getNeutral(d);
                })
            
            
            d3.select("#bench")
                .selectAll("div.node")
                .filter(function(d){
                    return d.pool;
                })
                .classed("angry",function(d){
                    //console.log(this)
                    return getAngry(d);
                })
                .classed("happy",function(d){
                    return getHappy(d);
                })
                .classed("neutral",function(d){
                    return getNeutral(d);
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
                    //console.log("adding node",d)
                    return "node " + d.id; 
                }).attr("r", function(d){return d.r;});

                svg_node.exit().remove();*/
            }
            force.start();
        }
        // Resolves collisions between d and all other circles.
        function collide(alpha) {
          var quadtree = d3.geom.quadtree(nodes);
          return function(d) {
            var r = d.r + maxRadius + padding,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
              if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.r + quad.point.r + padding;
                if (l < r) {
                  l = (l - r) / l * alpha;
                  d.x -= x *= l;
                  d.y -= y *= l;
                  quad.point.x += x;
                  quad.point.y += y;
                }
              }
              return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
          };
        }
        function removeParty(partyName) {
            //console.log("removeParty",partyName)
            //if(!party) {
            var party=parties.find(function(p){
                return p.name == partyName;
            });
            //}

            party.pool=false;

            utilities.updateURL(parties.filter(function(d){return d.pool;}).map(function(d){return d.name;}))
            updateView.feedback(false);

            nodes=nodes.filter(function(d){
                return d.id!=party.name;
            });
            force.nodes(nodes)

            links=links.filter(function(d){
                return d.target.id!=partyName && d.source.id!=partyName;
            });
            force.links(links);

            start();

        }
        function addParty(partyName,x,y,nostart) {
            var party=parties.find(function(p){
                return p.name == partyName;
            });
            if(party.pool) {
                return;
            }
            party.pool=true;

            //console.log("ANGRY",party.name,getAngry(party))

            

            
            
            
            d3.selectAll(".js-btn-reset").classed("hidden",false);
            

            utilities.updateURL(parties.filter(function(d){return d.pool;}).map(function(d){return d.name;}))

            nodes.push({
                name:party.name,
                vname:party.vname,
                id:party.name,
                x: x || Math.floor(Math.random() * width),
                y: y || 0,//Math.floor(Math.random() * height),
                size:party.size,
                r:rscale(party.size)
            });
            //console.log("->",nodes)
            for(var i=0;i<nodes.length;i++) {
                for(var j=i+1;j<nodes.length;j++) {
                    var __link={
                        source:nodes[i],
                        target:nodes[j]
                    };
                    if(!links.find(function(d){ return d.source.id==__link.source.id && d.target.id==__link.target.id})) {
                        links.push(__link);
                    }
                }
            }

            if(!nostart && parties.filter(function(d){return d.pool;}).length>1) {
                updateView.feedback(true,getAngry(party)); 
                //updateView.feedback(true,party.name);
            }

            if(!nostart) {
                start();
            }
        }   

    }

    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
      this.parentNode.appendChild(this);
      });
    };

    return Builder;

})
