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
            var twitterBaseUrl = "https://twitter.com/home?status=";
            var facebookBaseUrl = "https://www.facebook.com/dialog/feed?display=popup&app_id=741666719251986&link=";
            
            var shareImage = "pic.twitter.com/iDYuBxY4Ep";

            var partyList = updateData.getHashtaggedCoalition();
            var hashtaggedCoalition = partyList.join("+");

            partyList = updateData.getCoalition();
            var textCoalition = partyList.join("+");
            var pageUrl = "http://gu.com/p/47zp2";
            var myUrl = pageUrl + "#?" + textCoalition;
            
            var pageMessage = "#GE2015 interactive: Can you form a stable government? " + 
                    //hashtaggedCoalition + " = " + updateData.getSum() + " " + 
                    pageUrl + " " + shareImage;

            var myMessage = "My #GE2015 bloc: " + 
                    hashtaggedCoalition + " = " + updateData.getSum() + " " + 
                    myUrl + " " + shareImage;
            
            var shareWindow = "";
            var network = e.currentTarget.getAttribute('data-source'); 
            var type = e.currentTarget.getAttribute('data-type'); 

            //console.log(network, type);
            if(network === "twitter"){
                var message = (type === "page") ? pageMessage : myMessage; 
                shareWindow = 
                    twitterBaseUrl + 
                    encodeURIComponent(message);// + 
                    //"%20" + shareUrl; 

                //console.log(message);
            }else if(network === "facebook"){
                var url = (type === "page") ? pageUrl : myUrl; 
                shareWindow = 
                    facebookBaseUrl + 
                    encodeURIComponent(url) + 
                    "&picture=" + 
                    encodeURIComponent(shareImage) + 
                    "&redirect_uri=http://www.theguardian.com";
                
                //console.log(url);
            }
            //console.log(shareWindow);
            
            window.open(shareWindow, network + "share", "width=640,height=320");
        }
    }

    return setShareButtons;
});
