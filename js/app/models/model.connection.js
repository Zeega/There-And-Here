(function(Connections){

	Connections.Model = Backbone.Model.extend({

		defaults : {
			title : 'Untitled',
			
			//connections begin in nyc by default
			
			begin_lat: 40.7774,
			begin_lng:-73.9606,
			
			
		},

		url: function()
		{
			return null;
		},

		initialize : function()
		{
			var _this=this;
			//Create a random endpoint
			this.set({end_lat:Math.random()*80, end_lng:(0.5-Math.random())*360});
			this.set({latlngs: [new L.LatLng( 40.7774,-73.9606), new L.LatLng( _this.get('end_lat'),_this.get('end_lng'))]});
		},

		loadTags : function(successFunction, errorFunction)
		{
			
		},

	});

})(thereandhere.module("connections"));
