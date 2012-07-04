jQuery(function($)
{
	// Shorthand the application namespace
	var Thereandhere = thereandhere.app;
	
	Thereandhere.init();
	
	$('#back-to-map').click(function(){
		$('#tah-player').fadeOut('fast');
	});

});
