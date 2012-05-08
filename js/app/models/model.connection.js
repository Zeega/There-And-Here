(function(Connections){

	Connections.Model = Backbone.Model.extend({

		defaults : {
			title : 'Untitled',
			
			//connections begin in nyc by default
			
			
			begin_lat: 40.7774,
			begin_lng:-73.9606,
			selected:false,
			
			
		},

		url: function()
		{
			return null;
		},

		initialize : function()
		{
			var _this=this;
			
	
			this.itemCollections = [
				new Connections.Items.Collection({url:'js/data/losangeles.js'}),
				new Connections.Items.Collection({url:'js/data/tavehua.js'}),
				new Connections.Items.Collection({url:'js/data/paterson.js'}),
				new Connections.Items.Collection({url:'js/data/limuru.js'}),
				new Connections.Items.Collection({url:'js/data/bronx.js'}),
				new Connections.Items.Collection({url:'js/data/akuse.js'}),
			];
			
			this.itemCollections[0].fetch({success:function(collection,response){
					collection.reset(response.items[0].child_items);
					collection.tiles=response.items[0].attributes.tiles;
					collection.center_lat=response.items[0].media_geo_latitude;
					collection.center_lng=response.items[0].media_geo_longitude;
					console.log(collection);
				
				}});
			this.itemCollections[1].fetch({success:function(collection,response){
				collection.reset(response.items[0].child_items);
				collection.tiles=response.items[0].attributes.tiles;
				collection.center_lat=response.items[0].media_geo_latitude;
				collection.center_lng=response.items[0].media_geo_longitude;	
				console.log(collection);
			}});
		
			
			//Create a random endpoint
			//this.set({end_lat:Math.random()*80, end_lng:(0.5-Math.random())*360});
			this.set({latlngs: [new L.LatLng( 40.7774,-73.9606), new L.LatLng( _this.get('end_lat'),_this.get('end_lng'))]});
		},

		loadTags : function(successFunction, errorFunction)
		{
			
		},

	});

})(thereandhere.module("connections"));
