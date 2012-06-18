// This contains the module definition factory function, application state,
// events, and the router.
this.thereandhere = {
	// break up logical components of code into modules.
	module: function()
	{
		// Internal module cache.
		var modules = {};

		// Create a new module reference scaffold or load an existing module.
		return function(name) 
		{
			// If this module has already been created, return it.
			if (modules[name]) return modules[name];

			// Create a module and save it under this name
			return modules[name] = { Views: {} };
		};
	}(),

  // Keep active application instances namespaced under an app object.
  app: _.extend({
	

	init : function(){
		this.loadModules();
		this.isLoaded = true
		this.startRouter();
	},
	
	loadModules : function(){
		var _this=this;
		var Connections = thereandhere.module("connections");
		this.connectionsCollection = new Connections.Collection();

		_.each(lines.features,function(connection){
			_this.connectionsCollection.add(new Connections.Model(connection.properties));
		});

		this.connectionsMap=new Connections.Views.Map({collection:this.connectionsCollection});
	
	},
	
	startRouter: function(){
		var _this = this;
		var Router = Backbone.Router.extend({
			routes: {
				""							: 'loadMain',
				"connection/:connectionId"	: "goToConnection",

			},
			goToConnection : function( connectionId ){ _this.goToConnection( connectionId ) },
			loadMain : function(  ){ _this.loadMain() }
		});

		this.router = new Router();
		Backbone.history.start();
	},
	
	goToConnection : function(connectionId){
		$('#main').html(this.connectionsMap.render());
		this.connectionsMap.addMap();
		$('#home').click(function(){ thereandhere.app.home();});
		$('#fullscreen').click(function(){
			console.log('fff');
			var docElm = document.getElementById('tah-iframe');
			if (docElm.requestFullscreen) {
				docElm.requestFullscreen();
			}
			else if (docElm.mozRequestFullScreen) {
				docElm.mozRequestFullScreen();
			}
			else if (docElm.webkitRequestFullScreen) {
				docElm.webkitRequestFullScreen();
			}
		
		});
		console.log('GO TO Connection: '+connectionId);
		_.delay(function(){thereandhere.app.loadPlayer(connectionId);},2000);
	},

	loadMain : function( frame ){


		$('#main').html(this.connectionsMap.render());
		this.connectionsMap.addMap();
		$('#home').click(function(){ thereandhere.app.home();});
		$('#fullscreen').click(function(){
			console.log('fff');
			var docElm = document.getElementById('tah-iframe');
			if (docElm.requestFullscreen) {
				docElm.requestFullscreen();
			}
			else if (docElm.mozRequestFullScreen) {
				docElm.mozRequestFullScreen();
			}
			else if (docElm.webkitRequestFullScreen) {
				docElm.webkitRequestFullScreen();
			}
		
		});
			
	},
	
	home: function(){
		console.log('goin home');
		this.router.navigate('',{silent:true});
		$('#tah-zeega-player').empty();
		$('#tah-player').fadeOut('fast');
	
	},

	loadPlayer: function(connectionId){
	

		var connection=this.connectionsCollection.get(connectionId);

		var _this=this;
		var Connections = thereandhere.module("connections");
		this.router.navigate('connection/'+ connectionId, {silent:true});
		
		
		$('#map-bottom-title').html(connection.end);
		$('#map-top-title').html(connection.start);
		$('#tah-project-desc').html(connection.description);
		$('#project-author').html(connection.author);
		$('#connection-title').html(connection.start+'————————'+connection.end);
		
		
		this.navMaps=[
			new Connections.Views.NavMap({
				collection:connection.itemCollections[0]
			}),
			new Connections.Views.NavMap({
				collection:connection.itemCollections[1]
			})
		];
			
		
		$('#tah-map-top').empty().append(this.navMaps[0].render());
		$('#tah-map-bottom').empty().append(this.navMaps[1].render());
		
		$('#tah-player').fadeIn('fast',function(){ 
			_this.navMaps[0].addMap();
			_this.navMaps[1].addMap();
		});
		
		$('#tah-zeega-player').empty().append("<iframe id='tah-iframe' class='tah-iframe' src ='http://alpha.zeega.org/project/"+this.navMaps[0].collection.at(0).get('attributes').project_id+"/view#player/sequence/"+this.navMaps[0].collection.at(0).get('attributes').sequence_id+"/frame/"+this.navMaps[0].collection.at(0).get('attributes').frame_id+"' ></iframe>");
		
		$('#project-title').fadeOut('fast',function(){ $(this).html(_this.navMaps[0].collection.at(0).get('title')).fadeIn();});
		
		_.each( _.toArray(this.navMaps[0].collection), function(itemModel){		
			itemModel.on('selected',function(){
				$('#project_title').fadeOut('fast',function(){ $(this).html(itemModel.get('title')).fadeIn();});
				$('#tah-zeega-player').empty().append("<iframe id='tah-iframe' class='tah-iframe' src ='http://alpha.zeega.org/project/"+itemModel.get('attributes').project_id+"/view#player/sequence/"+itemModel.get('attributes').sequence_id+"/frame/"+itemModel.get('attributes').frame_id+"' ></iframe>");
			});
		});
		
		_.each( _.toArray(this.navMaps[1].collection), function(itemModel){		
			itemModel.on('selected',function(){
				$('#project_title').fadeOut('fast',function(){$(this).html(itemModel.get('title')).fadeIn();});
				$('#tah-zeega-player').empty().append("<iframe id='tah-iframe' class='tah-iframe'  src ='http://alpha.zeega.org/project/"+itemModel.get('attributes').project_id+"/view#player/sequence/"+itemModel.get('attributes').sequence_id+"/frame/"+itemModel.get('attributes').frame_id+"' ></iframe>");
			});	
		});
	},
	
}, Backbone.Events)


};
