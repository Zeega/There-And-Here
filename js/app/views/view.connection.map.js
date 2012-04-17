(function(Connections) {

	// This renders the main map interface View
	
	Connections.Views.Map = Backbone.View.extend({
			
		tagName : 'div',
		className: 'interface-map-wrapper',
	
		
		initialize : function(options)
		{
			_.extend(this,options);
			
			
			
			
			
		
			
			this.mapRendered=false;
			this.mapboxUrl = 'http://{s}.tiles.mapbox.com/v2/zeega.map-fbr9zj5s/{z}/{x}/{y}.png',
	    	this.mapboxAttrib = '',
	   		this.mapboxLayer = new L.TileLayer(this.mapboxUrl, {maxZoom: 18, attribution: this.mapboxAttrib});
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

			this.map = new L.Map(div,{
			
				scrollWheelZoom:false,
				doubleClickZoom:false,
				zoomControl:false,
			
			});
	    	this.map.setView(this.latlng, 2).addLayer(this.mapboxLayer);
	    	$('.leaflet-control-attribution').hide();
    		var that=this;
    
			//Draw connections on the map
			
			var _this=this;
			_.each( _.toArray(this.collection), function(connectionModel){
				
				
			
				
				var polyline = new L.Polyline(connectionModel.get('latlngs'), {color: 'red'})
				
				//Bind popup to to polyline – could also 
				//polyline.bindPopup(new Connections.Views.Popup({model:connectionModel}).render());
				
				polyline.on('click',function(){connectionModel.set({'selected':true});});
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
	
	Connections.Views.NavMap = Backbone.View.extend({
			
		tagName : 'div',
		className: 'navigation-map-wrapper',
	
		initialize : function(options)
		{
			_.extend(this,options);
			
			
		
			
			this.mapRendered=false;
			this.mapboxUrl = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
	    	this.mapboxAttrib = '',
	   		this.mapboxLayer = new L.TileLayer(this.mapboxUrl, {maxZoom: 18, attribution: this.mapboxAttrib});
			this.geoLocated=true;
		
			this.latlng = new L.LatLng( this.center_lat,this.center_lng);
		
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
			var div = $(this.el).find('.navigation-map').get(0);

			this.map = new L.Map(div);
	    	this.map.setView(this.latlng, 11).addLayer(this.mapboxLayer);
	    	$('.leaflet-control-attribution').hide();
    		var that=this;
    
			//Draw connections on the map
			console.log(this.collection);
			var _this=this;
			console.log(this);
			_.each( _.toArray(this.collection), function(itemModel){
				
				/*
				connectionModel.on('selected',function(){
					zeega.app.loadProject(connectionModel.id);
				
				});
				*/
				
				
				var circleMarker = new L.CircleMarker(itemModel.latlng(),{color:'red'})
				
				//Bind popup to to polyline – could also 
				//polyline.bindPopup(new Connections.Views.Popup({model:connectionModel}).render());
				
				circleMarker.on('click',function(){connectionModel.trigger('selected');});
				_this.map.addLayer(circleMarker);
					
			});
		},
	
		/* Template (currently just map container) */
	
		getTemplate : function()
		{
			var html =	'<div class="navigation-map"></div>';
			return html;
		}

	
	
	});

})(thereandhere.module("connections"));