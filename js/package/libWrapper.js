define(['jquery'], function () {
    'use strict';

    require.config({
        waitSeconds: 1,
        paths: {
            lib: [
                '//10.255.255.1/libFailing', // pending url to test timeout
                'package/libFallback' // fallback
            ]
        }
    });

    require(['lib'], function() {
        console.log('Lib loaded');
    });

});
