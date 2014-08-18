require.config({
	shim: {
        myLib: {
			deps: ['jquery']
		}
	},
	paths: {
		jquery: '../bower_components/jquery/jquery',
        myLib: 'package/libWrapper'
	}
});

require([
	'myLib'
], function () {
	// Initialize the application
});
