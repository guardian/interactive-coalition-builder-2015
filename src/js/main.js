define([
    'd3',
    'reqwest',
    'app/app.js',
    'common/polyfill.js',
    'text!templates/appTemplate.html',
    'json!data/data_remote.json'
], function(
    d3,
    reqwest,
    coalitionBuilder,
    polyfill,
    templateHTML,
    remoteData
) {
    'use strict';

    function handleRequestError(err, msg) {
        //console.error('Failed: ', err, msg);
        coalitionBuilder(remoteData);
    }

    function afterRequest(resp) {
        //console.log('Finished', resp);
    }

    function init(el, context, config, mediator) {
        // DEBUG: What we get given on boot
        //console.log(el, context, config, mediator);

        // DOM template example
        el.innerHTML = templateHTML;
        
        // Load remote JSON data
        var key = '1kEJiSPchMy6MCSThHDw5xaA37_LgFxJgTz7dLNhnSEI',
            url = 'http://interactive.guim.co.uk/spreadsheetdata/' + key + '.json';

        polyfill();
        
        reqwest({
            url: url,
            type: 'json',
            crossOrigin: true
        })
        .then(function(data) {
            /* Render coalition bulider */
            coalitionBuilder(data);
        })
        .then(function() {
            /* Render tabs */
            var head = document.querySelector('head'),
                script = document.createElement('script');
            script.setAttribute('src','http://interactive.guim.co.uk/2015/04/election-nav/electionNav.js');
            script.setAttribute('type','text/javascript');
            head.appendChild(script); 
        })        
        .fail(handleRequestError)
        .always(afterRequest);
    }

    return {
        init: init
    };
});
