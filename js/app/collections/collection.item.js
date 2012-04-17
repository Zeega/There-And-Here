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
			console.log(this);
			console.log(this.get('media_geo_latitude'));
			return  new L.LatLng( parseFloat(this.get('media_geo_latitude')),parseFloat(this.get('media_geo_longitude')));
			
		}
		


	});
	
	Connections.Items.Collection = Backbone.Collection.extend({

		model:	Connections.Items.Model,

			
		initialize : function(options)
		{
			_.extend(this,options);
			
			
			
			

		},
		
		url: function()
		{
			console.log(this.id);
			return "http://dev.zeega.org/james/web/api/collections/"+this.id;
		},
		
		
		


	});
	

})(thereandhere.module("connections"));
