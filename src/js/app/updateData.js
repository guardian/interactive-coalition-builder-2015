define([
    'common/utilities'
], function(
    util
){
    'use strict';

    var partyData, 
        sum = 0;
    
    
    function initParties(data, analysisData) {
        partyData  = [
            { party: "con"   , color: "#005789", group: 1 }, 
            { party: "lab"   , color: "#E31F26", group: 1 }, 
            { party: "libdem", color: "#FFB900", group: 2 },
            { party: "snp"   , color: "#FCDD03", group: 2 },
            { party: "green" , color: "#33A22B", group: 2 },
            { party: "pc"    , color: "#868686", group: 2 },
            { party: "sdlp"  , color: "#008587", group: 2 },
            { party: "others", color: "#B3B3B4", group: 2 },
            { party: "dup"   , color: "#99002E", group: 2 },
            { party: "ukip"  , color: "#7D0069", group: 2 }
        ];

        console.log("analysisData",analysisData)
        var flat_attractions={};

        partyData.map(function(d, i) {            
            d.seat = data[0][d.party]; //seat count
            d.size = data[1][d.party]; //radius of image 
            d.active = false;

            /*if(!flat_attractions[d.party]) {
                flat_attractions[d.party]={
                    a:[],
                    r:[],
                    aa:[],
                    rr:[]
                };
            }*/
            analysisData.forEach(function(pair){
                //console.log(pair,d.party)
                var partyPair=pair.pair.split(",");

                partyPair.forEach(function(party){
                    if(!flat_attractions[party]) {
                        flat_attractions[party]={
                            a:[],
                            r:[],
                            aa:[],
                            rr:[]
                        };
                    };
                    if(pair.mark!="") {
                        var other_party=partyPair[(partyPair.indexOf(party)+1)%2];
                        if(flat_attractions[party][pair.mark].indexOf(other_party)<0) {
                            flat_attractions[party][pair.mark].push(other_party);
                        }
                    }
                })

                /*
                if(partyPair.indexOf(d.party)>-1) {
                    partyPair.forEach(function(party){
                        if(party!=d.party) {
                            console.log(d.party,pair.mark,party);
                            if(pair.mark!="") {
                                flat_attractions[d.party][pair.mark].push(party);
                            }
                        }
                    })

                }
                */
            })

            

            /*
            // group 2, calculate position
            if (d.group === 2) {
                d.x = util.getOctagonX(i-1, r, cx, d.size);
                d.y = util.getOctagonY(i-1, r, cy,  d.size);
            }
            */



            return d;
        });

        console.log("flat_attractions",flat_attractions)

        // group 1
        /*
        partyData[0].x = cx + imgSize / 2 + 10 - partyData[0].size/2;
        partyData[0].y  = cy - partyData[0].size/2;
        partyData[1].x = cx - imgSize / 2 - 10 - partyData[1].size/2;
        partyData[1].y  = cy - partyData[1].size/2;
        */

        partyData.forEach(function(p){
            if(flat_attractions[p.party]) {
                p.attraction=flat_attractions[p.party].a;
                p.strong_attraction=flat_attractions[p.party].aa;
                p.repulsion=flat_attractions[p.party].r;
                p.strong_repulsion=flat_attractions[p.party].rr;    
            }
            
        })

        return partyData;
    }
    
    function setSum() {
        
        sum = partyData.filter(function(d) {
            return d.active;
        }).map(function(d) {
            return d.seat;
        }).reduce(function(pre, cur) {
            return pre + cur;
        }, 0);
    }
    
    function setActive(party, isActive) {
        var item = partyData.find(function(d) { 
            return d.party === party; 
        });
        
        item.active = isActive;
    }   
    
    function getSum() { return sum; }
    function getParties() { return partyData; }


    return {
        initParties: initParties,
        getParties: getParties,
        setSum: setSum,
        getSum: getSum,
        setActive: setActive
    };
});