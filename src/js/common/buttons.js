define([
], function(
) {
    'use strict';

    function setShareButtons() {    
        var shareButtons = document.querySelectorAll('.btns-share button');

        for (var i = 0; i < shareButtons.length; i++) {
            shareButtons[i].addEventListener('click',openShareWindow);
        }

        function openShareWindow(e){

            var network = e.currentTarget.getAttribute('data-source'); 
            var guardianUrl = "http://gu.com/p/47ctg";//+(currentView?("#"+currentView):"");
            var twitterBaseUrl = "https://twitter.com/home?status=";
            var facebookBaseUrl = "https://www.facebook.com/dialog/feed?display=popup&app_id=741666719251986&link=";
            var sharemessage = "Election 2015: My coalition http://gu.com/p/47ctg pic.twitter.com/vpDUQxkrJX";
            var shareWindow = "";
            var shareImage = "";//"http://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2015/";
            
            if(network === "twitter"){
                shareWindow = 
                    twitterBaseUrl + 
                    encodeURIComponent(sharemessage); + 
                    "%20" + 
                    "http://gu.com/p/47ctg"; 

            }else if(network === "facebook"){
                shareWindow = 
                    facebookBaseUrl + 
                    encodeURIComponent(guardianUrl) + 
                    "&picture=" + 
                    encodeURIComponent(shareImage) + 
                    "&redirect_uri=http://www.theguardian.com";
            }
            window.open(shareWindow, network + "share", "width=640,height=320");
        }
    }

    return setShareButtons;
});
