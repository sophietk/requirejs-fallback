require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        myLib: 'package/libWrapper'
    }
});

require([
    'jquery', 'myLib'
], function () {

    $('ul').append('<li>main loaded</li>');

});
