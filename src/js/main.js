define([
    'd3',
    'reqwest',
    'charts/mirrorlineInit.js',
    'charts/partycircleInit.js',
    'text!templates/appTemplate.html'
], function(
    d3,
    reqwest,
    mirrorlineChart,
    partycircleChart,
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
        var key = '1YilVzArect3kcE1rzJvYivXkfs1oL0MLCrvC9GjPF6E',
            url = 'http://interactive.guim.co.uk/spreadsheetdata/'+key+'.json';

        reqwest({
            url: url,
            type: 'json',
            crossOrigin: true
        })
        .then(function(data) {
            mirrorlineChart.render(data);
            partycircleChart.render(data);
        })
        .fail(handleRequestError)
        .always(afterRequest);
    }

    return {
        init: init
    };
});
