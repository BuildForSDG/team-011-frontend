/*
* herbyCookie jQuery plugin v1.3.2
*
* An easy jQuery plugin asking at user for cookie consent.
*
* Copyright (c) 2015 Paolo Basso
* https://github.com/paolobasso99/herbyCookie
* Licensed under the MIT license
* If you use hebyCookie you agree with our Terms of Service (https://github.com/paolobasso99/herbyCookie/blob/master/TermsOfService.md).
*/
(function ( $ ) {
 
    $.fn.herbyCookie = function( options ) {
 
        // Options
        var settings = $.extend({
            style: "dark",
            btnText: "Got it!",
            policyText: "Privacy policy",
            text: "We use cookies to ensure you get the best experience on our website, if you continue to browse you'll be acconsent with our",
            scroll: false,
            expireDays: 30,
            link: "/policy.html"
        }, options );
        
        // Html
        var herbyHtml = "<div class='herbyCookieConsent herbyIn'><p>"+settings.text+" "+"<a alt='"+settings.policyText+"' href='"+settings.link+"' target='_blank'>"+settings.policyText+"</a>.</p><a alt='"+settings.btnText+"' class='herbyBtn'>"+settings.btnText+"</a></div>";
        
        // Different style set up
        if(settings.style == "light"){
            var color = "#424242";
            var bg = "#f6f6f6"
        } else {
            var color = "#fff"
            var bg = "#222"
        };
        
        //CSS
        var herbyCss = "<!-- Herby Cookie Consent CSS -->"+'<style>@-webkit-keyframes herbyIn{from{-webkit-transform:translate3d(0, 100%, 0);transform:translate3d(0, 100%, 0);visibility:visible}to{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}}@keyframes herbyIn{from{-webkit-transform:translate3d(0, 100%, 0);transform:translate3d(0, 100%, 0);visibility:visible}to{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}}.herbyIn{-webkit-animation-name:herbyIn;animation-name:herbyIn}@-webkit-keyframes herbyOut{from{opacity:1}to{opacity:0;-webkit-transform:translate3d(0, 100%, 0);transform:translate3d(0, 100%, 0)}}@keyframes herbyOut{from{opacity:1}to{opacity:0;-webkit-transform:translate3d(0, 100%, 0);transform:translate3d(0, 100%, 0)}}.herbyOut{-webkit-animation-name:herbyOut;animation-name:herbyOut}.herbyCookieConsent{position:fixed;left:0;right:0;bottom:0;overflow:hidden;width:100%;background:'+bg+' none repeat scroll 0 0;color:'+color+';box-sizing:border-box;padding:15px 20px;vertical-align:middle;z-index:999;display:inline-block;-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;animation-fill-mode:both}.herbyCookieConsent p{display:inline-block;vertical-align:middle;font-size:1em;width:80%;float:left;font-family:"Helvetica Neue Light","HelveticaNeue-Light","Helvetica Neue","Calibri","Helvetica","Arial";margin-top:.7em}.herbyCookieConsent p a{color:#31a8f0;vertical-align:middle;font-size:1em}.herbyCookieConsent .herbyBtn{float:right;font-size:1em;text-decoration:none;border-bottom:1px solid #b0b0b0;border-top:none;border-left:none;border-right:none;text-align:center;padding:10px 8px 9px 8px;cursor:pointer;cursor:hand;line-height:21px !important;position:relative;border-radius:5px;border-bottom-width:3px;overflow:hidden;display:inline-block;word-wrap:break-word;background-color:#d32d27;color:#fff;border-color:#af0806;font-size:20px;padding-left:10px;padding-right:10px;width:auto;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle;-webkit-tap-highlight-color:rgba(255,255,255,0);tap-highlight-color:rgba(255,255,255,0)}.herbyCookieConsent .herbyBtn:hover{background-color:#c22a24;border-color:#910101;color:#fff;text-decoration:none;outline:none}.herbyCookieConsent .herbyBtn:focus{text-decoration:none;outline:none}.herbyCookieConsent .herbyBtn:active{background-color:#af0806;border-color:#af0806;color:#fff;padding-top:13px;padding-bottom:6px}@media all and (max-width:1000px){.herbyCookieConsent p{width:66%;font-size:.8em}.herbyCookieConsent .herbyBtn{padding:9px 8px 8px 8px}.herbyCookieConsent .herbyBtn:active{padding-top:12px;padding-bottom:5px}}@media all and (max-width:500px){.herbyCookieConsent{text-align:center}.herbyCookieConsent p{width:100%;float:none;text-align:left;font-size:.7em}.herbyCookieConsent .herbyBtn{float:none;margin-top:10px;padding:6px 8px 5px 8px}.herbyCookieConsent .herbyBtn:active{padding-top:9px;padding-bottom:2px}}</style>';
        
        // Set localStorage
        var herbyName = "herbyCookie"+"_"+window.location.hostname;
        var herbyStorage = JSON.parse(localStorage.getItem(herbyName));
        var herbyActualDate = Math.floor((new Date()).getTime() / 1000);
        
        // Open functions
        if(herbyStorage == null || herbyStorage.consens != true || herbyStorage.expireTime < herbyActualDate){
            $("body").append(herbyHtml), $("html").append(herbyCss);
        }
        
        
        // Close functions
        $(".herbyBtn").click(closeHerby);
        if(settings.scroll == true) {
            $(window).scroll(closeHerby);
        }
        
        function closeHerby() {
            // Set localStorage
            var herbyExpireDate = (herbyActualDate+(settings.expireDays*86400));
            var herbyJson = {consens : true, expireTime : herbyExpireDate};
            localStorage.setItem(herbyName, JSON.stringify(herbyJson));
            
            // Remove the Obj
            $(".herbyCookieConsent").removeClass("herbyIn").addClass("herbyOut");
            setTimeout(
                function() {
                    $(".herbyCookieConsent").remove();
                },
            1001);
        }
        
        // Set console error
        if(settings.style != "dark" && settings.style != "light") {
            console.error('hebyCookie: Invalid "style" option. Use "dark" or "light".');
        }
        if(typeof settings.scroll != "boolean") {
            console.error('hebyCookie: Invalid "scroll" option. Use a boolean value.');
        }
        if(isNaN(settings.expireDays)) {
            console.error('hebyCookie: Invalid "expireDays" option. Use a number.');
        }
        
    };
    
}(jQuery));
