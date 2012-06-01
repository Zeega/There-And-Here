(function(Connections){

	Connections.Model = Backbone.Model.extend({

		url: function()
		{
			return null;
		},

		initialize : function(options)
		{
			_.extend(this,options);
			
			var _this=this;
			this.itemCollections = [
				new Connections.Items.Collection({url:'js/data/'+this.start_file+'.js'}),
				new Connections.Items.Collection({url:'js/data/'+this.end_file+'.js'}),
			];
			
			this.itemCollections[0].fetch();
			this.itemCollections[1].fetch();
		
			this.set({latlngs: [new L.LatLng( 40.7774,-73.9606), new L.LatLng( _this.get('end_lat'),_this.get('end_lng'))]});
		},

		loadTags : function(successFunction, errorFunction)
		{
			
		},

	});

})(thereandhere.module("connections"));
