/********************************************

	THEREANDHERE.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/
require([
	'order!../lib/jquery-1.7.1.min',

	//data
	
	'order!../data/lines',


	//libraries
	'order!../lib/underscore',
	'order!../lib/backbone',
	'order!../lib/jquery/ui/js/jquery-ui.min',	
	'order!../lib/leaflet/leaflet',


	//core
	'order!../app/thereandhere',
	'order!../lib/bootstrap',

	//models
	
	'order!../app/models/model.connection',
	//collections
	
	'order!../app/collections/collection.connection',
	'order!../app/collections/collection.item',
	
	//views
	'order!../app/views/view.connection.map',
	
	//app
		
	'order!../app/index',
	

	], function(){});
