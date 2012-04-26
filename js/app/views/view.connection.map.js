(function(Connections) {

	// This renders the main map interface View
	
	Connections.Views.Map = Backbone.View.extend({
			
		tagName : 'div',
		className: 'interface-map-wrapper',
	
		
		initialize : function(options)
		{
			_.extend(this,options);
			
			
			
			
			
		
			
			this.mapRendered=false;
			this.mapboxUrl = 'http://{s}.tiles.mapbox.com/v2/zeega.griddedpopulation/{z}/{x}/{y}.png',
	    	this.mapboxAttrib = '',
	   		this.mapboxLayer = new L.TileLayer(this.mapboxUrl, {maxZoom: 18, attribution: this.mapboxAttrib});
			this.geoLocated=true;
		
			this.latlng = new L.LatLng( 23.1, -2.8);
		
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
			
				scrollWheelZoom:true,
				doubleClickZoom:true,
				zoomControl:false,
			
			});
	    	this.map.setView(this.latlng, 3).addLayer(this.mapboxLayer);
	    	$('.leaflet-control-attribution').hide();
    		var that=this;
    
			//Draw connections on the map
			
			var _this=this;
			var featureLayer = new L.GeoJSON();
			 var defaultStyle = {
				color: "#0099FF",
				weight: 4,
				opacity: 0.6,
				fillOpacity: 0.1,
				fillColor: "#0099FF"
			};
			
			var highlightStyle = {
				color: '#0099FF', 
				weight: 5,
				opacity: 0.6,
				fillOpacity: 0.65,
				fillColor: '#0099FF'
			};
			
			featureLayer.on("featureparse", function (e){
		 
				e.layer.setStyle(defaultStyle);
				(function(layer, properties) {
			  
			 	 layer.on("mouseover", function (e) {
				
					layer.setStyle(highlightStyle);
					var popup = $("<div></div>", {
					id: "popup-" + properties.id,
					css: {
						position: "absolute",
						bottom: "85px",
						left: "50px",
						zIndex: 1002,
						backgroundColor: "white",
						padding: "8px",
						border: "1px solid #ccc"
					}
				});
				// Insert a headline into that popup ADJUST STYLE HERE
				var hed = $("<div></div>", {
					text: properties.start + " –––––––––––– " + properties.end,
					css: {fontSize: "12px"}
				}).appendTo(popup);
				// Add the popup to the map
				popup.appendTo(div);
			  });
			  
			  layer.on("click",function(e){
			  	thereandhere.app.loadPlayer(thereandhere.app.connectionsCollection.at(0));
			 
			  
			  });
			  
			  
			  // Create a mouseout event that undoes the mouseover changes
			  layer.on("mouseout", function (e) {
				// Start by reverting the style back
				layer.setStyle(defaultStyle); 
				// And then destroying the popup
				console.log(properties.id);
				$("#popup-" + properties.id).remove();
			  });
			  // Close the "anonymous" wrapper function, and call it while passing
			  // in the variables necessary to make the events work the way we want.
			})(e.layer, e.properties);
		});
			
			featureLayer.addGeoJSON(lines);
			
			this.map.addLayer(featureLayer);
		
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
				
				circleMarker.on('click',function(){itemModel.trigger('selected');});
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