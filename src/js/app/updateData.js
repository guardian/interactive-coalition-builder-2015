define([
    'common/utilities'
], function(
    util
){
    'use strict';

    var partyData, 
        sum = 0;
    
    
    function initParties(data, cx, cy, r, imgSize) {
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

        partyData.map(function(d, i) {            
            d.seat = data[0][d.party]; //seat count
            d.size = data[1][d.party]; //radius of image 
            d.active = false;

            // group 2, calculate position
            if (d.group === 2) {
                d.x = util.getOctagonX(i-1, r, cx, d.size);
                d.y = util.getOctagonY(i-1, r, cy,  d.size);
            }
            return d;
        });
        // group 1
        partyData[0].x = cx + imgSize / 2 + 10 - partyData[0].size/2;
        partyData[0].y  = cy - partyData[0].size/2;
        partyData[1].x = cx - imgSize / 2 - 10 - partyData[1].size/2;
        partyData[1].y  = cy - partyData[1].size/2;

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