define([
    'd3',
    'reqwest',
    'app/init.js',
    'common/buttons.js',
    'text!templates/appTemplate.html'
], function(
    d3,
    reqwest,
    coalitionBuilder,
    socialButtons,
    templateHTML
) {
    'use strict';

    function handleRequestError(err, msg) {
        console.error('Failed: ', err, msg);
    }

    function afterRequest(resp) {
        console.log('Finished', resp);
    }

    function init(el, context, config, mediator) {
        // DEBUG: What we get given on boot
        console.log(el, context, config, mediator);

        // DOM template example
        el.innerHTML = templateHTML;

        // Load remote JSON data
        var key = '1kEJiSPchMy6MCSThHDw5xaA37_LgFxJgTz7dLNhnSEI',
            url = 'http://interactive.guim.co.uk/spreadsheetdata/' + key + '.json';

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
            
            /* Render social buttons */
            socialButtons();
        })        
        .fail(handleRequestError)
        .always(afterRequest);
    }

    return {
        init: init
    };
});
