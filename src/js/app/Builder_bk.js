define([
    'd3',
    'app/updateData',
    'app/updateView'
], function(
    d3,
    updateData,
    updateView
){
	'use strict';

	function Builder(options){

		var DEBUG=false;



        

        var nodes=[];
        var links=[];
        var maxRadius=60,
            padding=2;
        var rscale=d3.scale.sqrt().domain([1,274]).range([20,60]);
        var parties=[

            {
                name:"con",
                vname:"Con",
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
                vname:"Lab",
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
                vname:"SNP",
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
                vname:"libdem",
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
                vname:"Ukip",
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
                vname:"Green",
                index:5,
                size:1,
                neutral:[],
                repulsion:["dup","con"],
                attraction:["pc","lab","libdem","snp"],
                strong_attraction:[],
                strong_repulsion:["ukip"],
                pool:false,
                ox:0.8,
                oy:0.7
            },
            {
                name:"pc",
                vname:"PC",
                index:6,
                size:3,
                neutral:[],
                repulsion:["dup","con","ukip"],
                attraction:["lab","libdem","green"],
                strong_attraction:["snp"],
                strong_repulsion:[],
                pool:false,
                ox:0.1,
                oy:0.6
            },
            {
                name:"dup",
                vname:"DUP",
                index:7,
                size:9,
                neutral:[],
                repulsion:["lab","snp","green","libdem","pc"],
                attraction:["con","ukip"],
                strong_attraction:[],
                strong_repulsion:[],
                pool:false,
                ox:0.9,
                oy:0.5
            }

        ];

        
        
        
        var dragged = null,
            selected = null,
            dragged_node = null;
        var coalitions=d3.select(options.container || "#coalitions");
        var bench=coalitions.select(options.parties || "#parties");
        var playground=coalitions.select(options.playground || "#coalitions")
            .on("mousemove", mousemove)
            .on("mouseup", mouseup)
            .on("touchmove", mousemove)
            .on("touchend", mouseup)

        var bbox=playground.node().getBoundingClientRect(),
        	width = bbox.width,
            height = bbox.height;

        var bench_bbox=bench.node().getBoundingClientRect();

        var bubble=bench
            .selectAll("div.node")
            .data(parties)
            .enter()
                .append("div")
                .attr("class","node")
                    .style("left",function(d){
                        return (d.ox * bench_bbox.width) + "px";
                    })
                    .style("top",function(d){
                        return (d.oy * bench_bbox.height) + "px";
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

        bubble
                .append("div")
                    .attr("class","overlay")
        
        bubble
                .append("h3")
                    .text(function(d){return d.vname;})

        var dom_parties={};
        bench
            .selectAll("div.node")
                .select("div.party")
                    .each(function(d){
                        //console.log("----->",this);
                        dom_parties[d.name]=this;
                    })

        function redraw() {
            
            
            bench
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
            dragged.x = m[0];
            dragged.y = m[1];
            
            redraw();
        }

        function mousemove() {
            if (!dragged) return;
            var m = d3.mouse(coalitions.node());
            dragged.x = m[0];//Math.max(0, Math.min(width, m[0]));
            dragged.y = m[1];//Math.max(0, Math.min(height, m[1]));

            var party = dragged.name;

            
            
            /*updateData.setActive(party);
            updateData.setSum();
        	updateView.sum(updateData.getSum());*/

            redraw();
        }

        function mouseup() {
            if (!dragged) return;
            mousemove();
            
            //console.log(dragged);
            //console.log("END",d3.event.x,d3.event.y)

            
            node.classed("blurred",false);
            
            var party, isActive;
            if(dragged.y>height*0.33) {
                //console.log("START THE MESS!!!!");
                d3.select(dragged_node).classed("hidden",true)
                addParty(dragged.name,dragged.x,dragged.y-160);

                isActive = true;
            }
            if(dragged.y<=height*0.33) {
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

            updateData.setActive(party, isActive);
            updateData.setSum();
            
            updateView.sum();
            updateView.analysis(party, isActive);
            updateView.animation(party, isActive);

            dragged = null;
            dragged_node = null;
        }
        
        var distance={
            neutral:1,
            repulsion:4,
            attraction:1,
            strong_repulsion:6,
            strong_attraction:0.95
        }

        var distances={}
        var factor=1;
        parties.forEach(function(p){
            p.neutral.forEach(function(party_name){
                var party=parties.find(function(d){
                    return d.name==party_name;
                }),
                //dist=(rscale(Math.max(p.size,party.size))*1.5);
                dist=(rscale(p.size)+rscale(party.size))*1.5;

                dist=d3.max([dist,rscale(p.size),rscale(party.size)]);
                distances[p.name+"-"+party.name]=dist;
                distances[party.name+"-"+p.name]=dist;
                //distances[p.name+"-"+party.name]=(rscale(p.size)*factor+rscale(party.size)*factor)*distance.neutral;
                //distances[party.name+"-"+p.name]=(rscale(p.size)*factor+rscale(party.size)*factor)*distance.neutral;
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
        
        console.log(distances);
        
        var force = d3.layout.force()
                        .size([width, height])
                        .nodes(nodes)
                        .links(links)

        //force.gravity(0);

        force.charge(0)

        /*force.linkStrength(function(d){
            return 1;
        });*/
        force.linkDistance(function(d){
            console.log(d.source.name+"-"+d.target.name,distances[d.source.name+"-"+d.target.name]);
            return distances[d.source.name+"-"+d.target.name]
        });

        
        if(DEBUG) {


        var svg = playground.append("svg")
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

        var builder=playground.append("div").attr("class","builder");

        var node = builder.selectAll(".node");

        var dragging=null;

        force.on('tick',tick);

        start();

        function tick(e) {
            

            node
                .each(collide(0.5))
                .style("left", function(d) { 
                    var x=Math.max(d.radius, Math.min(width - d.radius, d.x))
                    return x+"px"; 
                })
                .style("top", function(d) { 
                    var delta=0,
                        y=Math.max(d.radius+delta, Math.min(height - (d.radius+delta), d.y))
                    return y+"px"; 
                })

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

            var bubble=node.enter()
                .append("div")
                .on("mousedown",function(d){
                    nodeMouseDown(d);
                    d3.select(this).classed("blurred",true);
                })
                .on("touchstart",function(d){
                    nodeMouseDown(d);
                    d3.select(this).classed("blurred",true);
                })
                .attr("class", "node")
                .append("div")
                    .attr("class",function(d){
                        return "party "+d.id;
                    })
                    .style("width", function(d){return (d.radius*2)+"px";})
                    .style("height", function(d){return (d.radius*2)+"px";})
                    .style("margin-left", function(d){return -(d.radius)+"px";})
                    .style("margin-top", function(d){return -(d.radius)+"px";})
                    .style("border-radius",function(d){return (d.radius*2)+"px";});

            bubble
                .append("div")
                    .attr("class","overlay")

            bubble
                .append("h3")
                    .text(function(d){return d.vname;})

            /*.append(function(d){
                        return dom_parties[d.id];
                    })*/

            node.exit().remove();

            node.classed("angry",function(d){
                var status=false;
                //console.log("checking angry",d,nodes_flat)
                var party=parties.find(function(p){
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
                var party=parties.find(function(p){
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

            }
            force.start();
        }

        // Resolves collisions between d and all other circles.
        function collide(alpha) {
          var quadtree = d3.geom.quadtree(nodes);
          return function(d) {
            var r = d.radius + d.radius + padding,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
              if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + padding;
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
            var party=parties.find(function(p){
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
                vname:party.vname,
                id:party.name,
                x: x || Math.floor(Math.random() * width),
                y: y || 0,//Math.floor(Math.random() * height),
                radius:rscale(party.size)
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
                    if(!links.find(function(d){ return d.source.id==__link.source.id && d.target.id==__link.target.id})) {
                        links.push(__link);
                    }
                }
            }

            //console.log("ADD LINKS",links)

            start();
        }   
        

	}

	return Builder;

})
