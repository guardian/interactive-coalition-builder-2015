define([
], function(
){
    'use strict';
    
    function updateSum(sum) {
        var txtSeat = (sum > 1) ? " seats" : " seat",
            txtShort = ((326-sum) > 0) ? "just " + (326-sum) + " short" : "Bravo!";
        document.querySelector(".js-seatcount").textContent = sum + txtSeat;
        document.querySelector(".js-seatshort").textContent = "(" + txtShort + ")";
    }


    return {
        sum: updateSum
    };
});
