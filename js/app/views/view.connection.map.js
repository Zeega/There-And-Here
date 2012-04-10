(function(Connections) {

	// This renders the main map interface View
	
	Connections.Views.Map = Backbone.View.extend({
			
		tagName : 'div',
		className: 'map',
	
		initialize : function()
		{
		
			
			this.collection = new Connections.Collection();
		
			//Populate with 10 fake connections
			for(var i = 0; i<10 ;i++){
			
				this.collection.add(new Connections.Model());
			
			}
			
		
			
			this.mapRendered=false;
			this.cloudmadeUrl = 'http://{s}.tiles.mapbox.com/v2/zeega.map-fbr9zj5s/{z}/{x}/{y}.png',
	    	this.cloudmadeAttrib = '',
	   		this.cloudmade = new L.TileLayer(this.cloudmadeUrl, {maxZoom: 18, attribution: this.cloudmadeAttrib});
			this.geoLocated=true;
		
			this.latlng = new L.LatLng( 40.7774,-73.9606);
		
			//use template to clone the database items into
			var template = _.template( this.getTemplate() );
			//copy the cloned item into the el
			$(this.el).append( template(  ) );
		},
	
		events : {
		
		
		},
	
		render : function( )
		{
			return this.el;
		},
	
	
		/*  Map must be rendered after container has been added to the DOM */
	
		addMap:function()
		{
			console.log('adding map');
			this.mapRendered=true;
			var div = $(this.el).find('.interface-map').get(0);

			this.map = new L.Map(div);
	    	this.map.setView(this.latlng, 2).addLayer(this.cloudmade);
	    	$('.leaflet-control-attribution').hide();
    		var that=this;
    
			//Draw connections on the map
			
			var _this=this;
			_.each( _.toArray(this.collection), function(connectionModel){
				
				var polyline = new L.Polyline(connectionModel.get('latlngs'), {color: 'red'})
				
				//Bind popup to to polyline – could also 
				polyline.bindPopup(new Connections.Views.Popup({model:connectionModel}).render());
				_this.map.addLayer(polyline);
					
			});
		},
	
		/* Template (currently just map container) */
	
		getTemplate : function()
		{
			var html =	'<div class="interface-map"></div>';
			return html;
		}

	
	
	});

})(thereandhere.module("connections"));