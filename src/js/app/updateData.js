define([
    'common/utilities'
], function(
    util
){
    'use strict';

    var partyData, 
        mapTable, 
        sum = 0;
    
    
    function initParties(data, cx, cy, r, imgSize) {
        partyData  = [
            { party: "con"   , color: "#005789", group: 1, img:"con3" }, 
            { party: "lab"   , color: "#E31F26", group: 1, img:"lab3" }, 
            { party: "ld"    , color: "#FFB900", group: 2, img:"ld2" },
            { party: "snp"   , color: "#FCDD03", group: 2, img:"snp2" },
            { party: "grn"   , color: "#33A22B", group: 2, img:"others" },
            { party: "pc"    , color: "#868686", group: 2, img:"others" },
            { party: "sdlp"  , color: "#008587", group: 2, img:"others" },
            { party: "others", color: "#B3B3B4", group: 2, img:"others" },
            { party: "dup"   , color: "#99002E", group: 2, img:"others" },
            { party: "ukip"  , color: "#7D0069", group: 2, img:"others" }
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
    
    function getPartyName(party) {
        var partyDic = {
            con: "Conservatives",
            lab: "Labour",
            ld: "Lib Dem",
            snp: "SNP",
            grn: "Green",
            pc: "PC",
            sdlp: "SDLP",
            others: "Others",
            dup: "DUP",
            ukip: "Ukip"
        };
        return partyDic[party];
    }


    function setTable(table) {
        mapTable = table;
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
        partyData.filter(function(d) {
            return d.party === party;
        }).map(function(d){
            d.active = isActive;
            return d;
        });
    }   
    
    function getSum() { return sum; }
    function getParties() { return partyData; }
    function getTable() { return mapTable; }


    return {
        initParties: initParties,
        getParties: getParties,
        getPartyName: getPartyName,
        setSum: setSum,
        getSum: getSum,
        setActive: setActive,
        setTable: setTable,
        getTable: getTable
    };
});
