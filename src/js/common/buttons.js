define([
    'app/updateData'
], function(
    updateData
) {
    'use strict';

    function setShareButtons() {    
        var shareButtons = document.querySelectorAll('.btns-share button');

        for (var i = 0; i < shareButtons.length; i++) {
            shareButtons[i].addEventListener('click',openShareWindow);
        }

        function openShareWindow(e){
            var network = e.currentTarget.getAttribute('data-source'); 
            var twitterBaseUrl = "https://twitter.com/home?status=";
            var facebookBaseUrl = "https://www.facebook.com/dialog/feed?display=popup&app_id=741666719251986&link=";
            var shareImage = "pic.twitter.com/vpDUQxkrJXi"; //TODO: replace
            var shareWindow = "";

            var partyList = updateData.getCoalition();
            var textCoalition = partyList.join("+");
            
            var pageUrl = "http://gu.com/p/47" + "zp2" /*+ "ctg"*/;
            var shareUrl = pageUrl + "?" + textCoalition;
            
            var sharemessage = "My coalition is " + 
                    textCoalition + ", " + updateData.getSum() + " seats " + 
                    shareUrl + " " + shareImage + " " + "#GE2015";
            
            //console.log(sharemessage);
            if(network === "twitter"){
                shareWindow = 
                    twitterBaseUrl + 
                    encodeURIComponent(sharemessage) + 
                    "%20" + shareUrl; 

            }else if(network === "facebook"){
                shareWindow = 
                    facebookBaseUrl + 
                    encodeURIComponent(shareUrl) + 
                    "&picture=" + 
                    encodeURIComponent(shareImage) + 
                    "&redirect_uri=http://www.theguardian.com";
            }
            window.open(shareWindow, network + "share", "width=640,height=320");
        }
    }

    return setShareButtons;
});
