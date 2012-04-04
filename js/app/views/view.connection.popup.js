(function(Connections) {


	Connections.Views.Popup = Backbone.View.extend({
			
		
		tagName : 'div',
		className: 'item-map-popup',
		
		initialize : function()
		{
		
			var blanks = {
				begin_lat : this.model.get('begin_lat').toString().substring(0,5),
				begin_lng : this.model.get('begin_lng').toString().substring(0,5),
				end_lat : this.model.get('end_lat').toString().substring(0,5),
				end_lng : this.model.get('end_lng').toString().substring(0,5)
			};
			//use template to clone the database items into
			var template = _.template( this.getTemplate() );
			//copy the cloned item into the el
			$(this.el).append( template( blanks ) );
	
		},
		

		render : function( )
		{
			return this.el;
		},
	
		getTemplate : function()
		{
			var html =	"<span class='connection-description' >This connection begins at: <br> <%= begin_lat %>, <%= begin_lng %><br> and ends at:<br> <%= end_lat %>,<%= end_lng %><br>"+
			"We will eventually want clicks to take us directly to new view... Unfortunately, leaflet doesn't support polyline hover events, so might require a little extra effort!</span>";
	
			return html;
		}
		
	
	});

})(thereandhere.module("connections"));