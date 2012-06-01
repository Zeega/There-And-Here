(function(Connections) {


	
	Connections.Items=Connections.Items||{}
	
	Connections.Items.Model = Backbone.Model.extend({



		initialize : function()
		{

		},
		
		url: function()
		{
			
		},
		latlng: function()
		
		{
			
			return  new L.LatLng( parseFloat(this.get('media_geo_latitude')),parseFloat(this.get('media_geo_longitude')));
			
		}
		


	});
	
	Connections.Items.Collection = Backbone.Collection.extend({

		model:	Connections.Items.Model,

			
		initialize : function(options)
		{
			_.extend(this,options);
		},
		
		parse: function(data)
		{
			this.tiles=data.items[0].tiles;
			this.zoom=data.items[0].attributes.zoom;
			this.center_lat=data.items[0].media_geo_latitude;
			this.center_lng=data.items[0].media_geo_longitude;
			return data.items[0].child_items;
		},
		
		


	});
	

})(thereandhere.module("connections"));
