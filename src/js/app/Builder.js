define([
    'd3',
    'app/updateData',
    'app/updateView',
    'common/utilities'
], function(
    d3,
    updateData,
    updateView,
    utilities
){
    'use strict';

    function Builder(options){

        var DEBUG=false;

        console.log("v0.6")

        //console.log(options)
        
        

        var nodes=[];
        var links=[];

        var maxRadius=60,
            padding=2;
        var radiuses={
            mobile:[20,40],
            restoftheworld:[32,60]
        }
        var rscale=d3.scale.sqrt()
                .domain([1,d3.max(options.data,function(d){return d.seat;})]);

        var attractionTable={
            "con":{
                vname:"Con",
                ox:0.345,
                oy:0.6,
                active:true
            },
            "lab":{
                vname:"Lab",
                ox:0.655,
                oy:0.6,
                active:true
            },
            "snp":{
                vname:"SNP",
                ox:0.76,
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
                oy:0.8
            },
            "pc":{
                vname:"PC",
                ox:0.9,
                oy:0.165
            },
            "dup":{
                vname:"DUP",
                ox:0.1,
                oy:0.5
            },
            "sdlp":{
                vname:"SDLP",
                ox:0.9,
                oy:0.65
            }
        };

        var parties=[];

        options.data.forEach(function(d){


            var party=attractionTable[d.party];
            if(party) {
                //console.log(party,d)
                party.name=d.party;
                party.size=d.seat;
                party.pool=d.active;
                party.repulsion=d.repulsion;
                party.attraction=d.attraction;
                party.strong_attraction=d.strong_attraction;
                party.strong_repulsion=d.strong_repulsion;

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

                return Math.max(600,size.height-80)+"px";
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
                        return !d.active;
                    })
                    .style("left",function(d){
                        d.bx=(d.ox * width_bn);
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

        bubble_inset
                .append("h3")
                    .text(function(d){return d.vname;});

        bubble_inset
                .append("h4")
                    .text(function(d){return d.size;})


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
            console.log("updateBench")
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

        function mouseup() {
            if (!dragged) return;
            //console.log("mouseup")
            mousemove();
            
            //console.log(dragged);
            //console.log("END",d3.event.x,d3.event.y)

            
            node.classed("blurred",false);
            playground.classed("dropping",false);
            bench.classed("show-active",false);
            
            d3.select("#bench")
                .selectAll("div.node")
                    .classed("dragging",false)
                    .classed("blurred",false)
                    .each(function(d){
                        d.active=true;
                    });
            
            var party, isActive;
            if(dragged.y>height_bn) {
                
                
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
                

                isActive = true;
            }
            if(dragged.y<height_bn) {
                
                removeParty(dragged.name);

                isActive = false;

                dragged.x=null;
                dragged.y=null;

                d3.select(dragged_node)
                    .transition()
                    .duration(500)
                        .style("left",function(d){
                            return (d.ox * width) + "px";
                        })
                        .style("top",function(d){
                            return (d.oy * height/2) + "px";
                        })

                d3.select("#bench")
                    .selectAll("div.node")
                        .filter(function(d){
                            return !d.pool;
                        })
                        .classed("happy",false)
                        .classed("angry",false)
            }
           
            party = dragged.name;
            updateData.setActive(party, isActive);
            updateData.setSum();
            updateView.sum();

            //TODO: improve speed on mouseup
            setTimeout(function(){
                updateView.analysis(party, isActive);
                updateView.animation(party, isActive);    
            },500);
            

            dragged = null;
            dragged_node = null;

            setPlaygroundStatus();
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
                    var delta=2;
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
        var nodes_flat=[];
        function getAngry(d,debug) {
            if(debug){
                //console.log("getAngry",d,nodes_flat)
            }
            var status=false;
            var party=parties.find(function(p){
                return p.name == d.name;
            });
            if(debug) {
                //console.log("party",party)
            }
            status=nodes_flat.some(function(d){
                return (party.repulsion.indexOf(d)>-1 || party.strong_repulsion.indexOf(d)>-1);
            });
            if(debug) {
                //console.log("status",status)
            }
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

        function start() {
            
            node = node.data(force.nodes(), function(d) { return d.id; });
            
            nodes_flat=force.nodes().map(function(d){
                return d.id;
            });
            
            function nodeMouseDown(d,coords){
                console.log("coords",coords)

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

            bubble_inset
                    .append("h3")
                        .text(function(d){return d.vname;});

            bubble_inset
                    .append("h4")
                        .text(function(d){return d.size;})

            node.exit().remove();

            node
                .classed("angry",function(d){
                    return getAngry(d);
                })
                .classed("happy",function(d){
                    return getHappy(d);
                })

            d3.select("#bench")
                .selectAll("div.node")
                .filter(function(d){
                    return d.pool;
                })
                .classed("angry",function(d){
                    //console.log(this)
                    return getAngry(d,1);
                })
                .classed("happy",function(d){
                    return getHappy(d);
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
        function addParty(partyName,x,y) {
            var party=parties.find(function(p){
                return p.name == partyName;
            });
            if(party.pool) {
                return;
            }

            party.pool=true;

            nodes.push({
                name:party.name,
                vname:party.vname,
                id:party.name,
                x: x || Math.floor(Math.random() * width),
                y: y || 0,//Math.floor(Math.random() * height),
                size:party.size,
                r:rscale(party.size)
            });
            
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
            start();
        }   

    }

    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
      this.parentNode.appendChild(this);
      });
    };

    return Builder;

})
