define([
    'common/utilities'
], function(
    util
){
    'use strict';

    var partyData, 
        coalitionList = [], 
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
            { party: "dup"   , color: "#99002E", group: 2 },
            { party: "ukip"  , color: "#7D0069", group: 2 }
        ];

        //console.log("analysisData",analysisData)
        var flat_attractions={};

        partyData.map(function(d, i) {            
            d.seat = data[0][d.party]; //seat count
            d.size = data[1][d.party]; //radius of image 
            d.active = false;

            analysisData.forEach(function(pair){
                //console.log(pair,d.party)
                var partyPair=pair.pair.split(",");

                partyPair.forEach(function(party){
                    if(!flat_attractions[party]) {
                        flat_attractions[party]={
                            n:[],
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
            });

            /*
            // group 2, calculate position
            if (d.group === 2) {
            d.x = util.getOctagonX(i-1, r, cx, d.size);
            d.y = util.getOctagonY(i-1, r, cy,  d.size);
            }
            */

            return d;
        });

        //console.log("flat_attractions",flat_attractions)

        // group 1
        /*
           partyData[0].x = cx + imgSize / 2 + 10 - partyData[0].size/2;
           partyData[0].y  = cy - partyData[0].size/2;
           partyData[1].x = cx - imgSize / 2 - 10 - partyData[1].size/2;
           partyData[1].y  = cy - partyData[1].size/2;
           */

        partyData.forEach(function(p){
            if(flat_attractions[p.party]) {
                p.neutral=flat_attractions[p.party].n;
                p.attraction=flat_attractions[p.party].a;
                p.strong_attraction=flat_attractions[p.party].aa;
                p.repulsion=flat_attractions[p.party].r;
                p.strong_repulsion=flat_attractions[p.party].rr;    
            }

        });

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
    
    function setActiveAll(isActive) {
        partyData.forEach(function(d) { 
            d.active = isActive; 
        });
    }
    
    function setCoalition(data) {
        coalitionList = data;
    }

    function getSum() { return sum; }
    function getParties() { return partyData; }
    function getCoalition() { return coalitionList; }

    function getHashtaggedCoalition() { 
        var hashtags={
            "con":"#Conservative",
            "lab":"#Labour",
            "snp":"#SNP",
            "green":"#Greens",
            "ukip":"#UKIP",
            "libdem":"#LibDems",
            "sdlp":"#SDLP",
            "pc":"#plaid15",
            "dup":"#DUP"
        };
        return coalitionList.map(function(d){
            return hashtags[d];
        });
    }

    return {
        initParties: initParties,
        getParties: getParties,
        setCoalition: setCoalition,
        getCoalition: getCoalition,
        getHashtaggedCoalition:getHashtaggedCoalition,
        setSum: setSum,
        getSum: getSum,
        setActive: setActive,
        setActiveAll: setActiveAll
    };
});
