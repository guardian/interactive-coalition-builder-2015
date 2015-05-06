define([
], function(
){
    'use strict';

    /* udtilities: get window size */
    function getWindowSize() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;

        return {
            width: x, 
            height: y
        };    
    }
    

    /* udtilities: get Octagon vertices */
    // "i"ndex of vertex, "r"adius, "c"enter position "x"/"y", "size" of the image
    function getOctagonX(i, r, cx, size) { 
        return cx + r * Math.cos(2 * Math.PI * i / 8) - size / 2;
    }
    function getOctagonY(i, r, cy, size) { 
        var rShift = r * 2/3;
        return cy + rShift * Math.sin(2 * Math.PI * i / 8) - size / 2;
    }
 

    /* udtilities: underscore */
    // https://github.com/lodash/lodash/blob/e914b83a1b97345fbd8cb68197caf7380bea331d/vendor/underscore/underscore.js

    var now = Date.now || function() {
        return new Date().getTime();
    };

    // _.throttle
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    // A (possibly faster) way to get the current timestamp as an integer.
    var throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) { options = {}; }
        var later = function() {
            previous = options.leading === false ? 0 : now;
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) { context = args = null; }
        };
        return function() {
            var now = now;
            if (!previous && options.leading === false) { previous = now; }
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) { context = args = null; }
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    function updateURL(parties) {
        console.log("updateURL",parties);
        
        var hash=window.location.hash.split("?")[0];
        
        hash+="?"+parties.join("+");

        window.location.hash=hash;

    }
    function getActiveList() {

        var hash=window.location.hash;
        
        if(hash.length<3 || hash.indexOf("?")<0) {
            return [];
        }

        var list=[];
        if(hash=="") {
            return list;
        }
        
        var str_list=hash.split("?");
        
        if(str_list.length<2) {
            return [];
        }
        return str_list[1].split("+");
    }

    return {
        getWindowSize: getWindowSize,
        getOctagonX: getOctagonX,
        getOctagonY: getOctagonY,
        throttle: throttle,
        getActiveList:getActiveList,
        updateURL:updateURL
    };
});
