define(['jquery'], function () {
    'use strict';

    $('ul').append('<li>libWrapper loaded</li>');

    require.config({
        waitSeconds: 1,
        paths: {
            lib: [
                '//10.255.255.1/libFailing', // pending url to test timeout
                'package/libFallback' // fallback
            ]
        }
    });

    require(['lib'], function () {
        $('ul').append('<li>lib (=libFallback) loaded</li>');
    });

});
