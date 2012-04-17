/*---------------------------------------------


	Object: Player
	The Zeega project web player. Part of Core.


	ideas:
	master list of layers/frames - loading/loaded to check against

---------------------------------------------*/

var Player2 = Backbone.View.extend({
		
	loadAheadDistance : 2,
	overlaysHidden : false,
	viewportRatio : 1.5,
	zeega : true,
	
	
	
	
	initialize : function( divId )
	{
		//placeholder model
		this.model= new Backbone.Model();
		this.container=$('#'+divId);
		
		
		this.generateBackbone();
		
		var _this=this;
		this.model.on('sequences_loaded',function(){
			_this.render();
			_this.setCurrentSequence( _this.initial_s );
			_this.setCurrentFrame( _this.initial_f );
			_this.setCurrentLayers();
			
			//this.currentFrame.on('ready', this.renderCurrentFrame, this);
			console.log('current sequence/frame/layers')
			console.log(_this.currentSequence)
			console.log(_this.currentFrame)
			console.log(_this.currentLayers)
			
			_this.goToFrame( _this.currentFrame );
		});
	
	},
	
	loadProjectFromBootstrap: function()
	{
		
		
		this.parseData( data );
		
		var s = ( _.isUndefined(options) || _.isUndefined(options.sequenceID) ) ? data.project.sequences[0].id : options.sequenceID;
		var f = ( _.isUndefined(options) || _.isUndefined(options.frameID) ) ? _.find(data.project.sequences, function(seq){return seq.id == s }).frames[0].id : options.frameID;
		
		
	},
	
		
	loadProjectById : function(projectId, options){
	
		//this.resetPlayer();
		var _this = this;
		$.getJSON('http://dev.zeega.org/james/web/api/projects/'+projectId,function(data){
			_this.sequences = new _this.Sequences(data.project.sequences);
		 	
		 	_this.initial_s = ( _.isUndefined(options) || _.isUndefined(options.sequenceID) ) ? data.project.sequences[0].id : options.sequenceID;
			_this.initial_f = ( _.isUndefined(options) || _.isUndefined(options.frameID) ) ? _.find(data.project.sequences, function(seq){return seq.id == _this.initial_s }).frames[0].id : options.frameID;
			console.log(_this.initial_s);
			console.log(_this.initial_f);
			
		 	_this.model.trigger('sequences_loaded');
		 	
		 	console.log(_this.sequences );
		 });
		
	
	
	
	},
	
	
	
	/*****************************
	
	PLAYER FUNCTIONS
	
	*****************************/
	
	loadAhead : function()
	{
		//find the frame you're coming from and where it is in the order
		var frameOrder = this.currentSequence.get('frameOrder') || _.pluck( _.toArray(this.currentSequence.frames), 'id' );
		this.currentSequence.set('frameOrder',frameOrder);
		var index = _.indexOf( frameOrder, this.currentFrame.id );

		//see if frame's layers are preloaded // starting with the currentFrame
		//look ahead 2 and behind 2 // include current frame also
		
		for (var i = 0  ; i < this.loadAheadDistance * 2 + 1 ; i++ )
		{
			//the offset spirals outward to load nearest frames first
			var offset = Math.ceil(i/2) * (-1+(2*(i%2)));
			var tryIndex = index + offset;
			if(tryIndex >= 0 && tryIndex < frameOrder.length)
			{
				var frameID = frameOrder[tryIndex];
				var frame = this.currentSequence.frames.get( frameID );
				if( frame.status != 'loading' && frame.status != 'ready' )
					this.preloadFrame( frame );
			}	
		}
	},
	
	preloadFrame : function( frame )
	{
		var _this = this;
		
		if(this.currentFrame == frame)
		{
			$('#zeega-player').prepend( frame.loader.render().el );
		}
		
		
		_.each( frame.get('layers'), function(layerID){
			var layer = _this.currentSequence.layers.get( layerID );
			if( layer.status != 'loading' && frame.status != 'ready' )
			{
				_this.preloadLayer( layer )
			}
		});
		frame.trigger('loading', frame.id);
	},
	
	preloadLayer : function( layer )
	{
		layer.trigger('loading', layer.id)
		
		this.$el.find('#preview-media').append( layer.visual.render().el );
		layer.trigger('player_preload');
	},
	
	goToFrame : function( frame )
	{
		this.clearStage( frame );
		
		if( frame.status == 'ready') this.renderFrame(frame.id )
		else frame.on('ready', this.renderFrame, this );

		this.loadAhead();
	},
	
	clearStage : function( frame )
	{
		var _this = this;
		var oldLayers = this.currentFrame.get('layers');
		var newLayers = frame.get('layers');
		
		var removeLayers = _.difference(oldLayers, newLayers);
		_.each( removeLayers, function( layerID ){
			_this.currentSequence.layers.get( layerID ).trigger('player_exit')
		})
	},
	
	renderFrame : function( id )
	{
		var _this = this;
		var frame = this.currentSequence.frames.get(id);
		frame.off('ready', this.renderFrame);
		
		_.each( frame.get('layers'), function(layerID,i){
			_this.currentSequence.layers.get( layerID ).trigger('player_play',i+1);
		})
		
		this.setAdvance( frame.get('attr').advance )
		
		this.currentFrame = frame;
		
		this.updateCitations();
		
		this.updateArrows();
	},
	
	setAdvance : function( adv )
	{
		var _this = this;
		
		if(this.t) clearTimeout( this.t )
		
		console.log('set advance: '+ adv)
		if(adv == -1) //manual control
		{
			//do nothing
		}
		else if(adv == 0) //after playback - default
		{
			
		}
		else if(adv > 0) //after n seconds
		{
			this.t = setTimeout( function(){ _this.goRight() },adv*1000 )
		}
	},
	
	goLeft : function()
	{
		var frame = this.getLeft();
		if( frame ) this.goToFrame( frame );
	},
	
	goRight : function()
	{
		var frame = this.getRight();
		if( frame ) this.goToFrame( frame );
	},
	
	getLeft : function( step )
	{
		if( _.isUndefined( step ) ) step = 1;
		var frameOrder = this.currentSequence.get('frameOrder');
		var index = _.indexOf( frameOrder, this.currentFrame.id );
				
		if( index - step < 0 ) return false;
		else return this.currentSequence.frames.get( frameOrder[index-step] );
	},
	
	getRight : function( step )
	{
		if( _.isUndefined( step ) ) step = 1;
		var frameOrder = this.currentSequence.get('frameOrder');
		var index = _.indexOf( frameOrder, this.currentFrame.id );
		
		if( index+1 + step > frameOrder.length ) return false;
		else return this.currentSequence.frames.get( frameOrder[index+step] );
	},
	
	updateCitations : function()
	{
		var _this = this;
		var Citation = Backbone.View.extend({
			tagName : 'li',
			className : 'clearfix',
			render : function()
			{
				$(this.el).html( _.template(this.getTemplate(),this.model.attributes ) )
			},
			
			events : {
				'click' : 'expandCitation'
			},
			
			expandCitation : function()
			{
				_this.expandCitationBar();
				
				if(this.$el.find('.citation-content').is(':hidden') ) this.$el.find('.citation-content').show('fast');
				else if(this.$el.find('.citation-content').is(':visible') ) this.$el.find('.citation-content').hide('fast');
			},
			
			getTemplate : function()
			{
				var html =

					'<div class="citation-tab">'+
						'<span class="zicon grey zicon-<%= type %>"></span>'+
					'</div>'+
					'<div class="citation-content hidden">'+
						'<div class="citation-thumb"><img width="100%" height="100%" src="<%= attr.thumbnail_url %>"/></div>'+
						'<div class="citation-body">'+
							'<div class="citation-title"><%= attr.title %></div>'+
							'<div class="citation-metadata"><a href="<%= attr.attribution_url %>" target="blank">Link to original</a></div>'+
						'</div>'+
					'</div>';
				return html;
			}
		});
		
		this.$el.find('#citation ul').empty();
		_.each( this.currentFrame.get('layers'), function(layerID){
			var layer = _this.currentSequence.layers.get( layerID );
			
			if( !layer.citation ) layer.citation = new Citation({model:layer});
			layer.citation.render();
			_this.$el.find('#citation ul').append( layer.citation.el );
		})
	},
	
	closePlayer : function()
	{
		var _this = this;
		
		//unhide editor
		$('#wrapper').show();

		this.unsetListeners();
		_.each( _.toArray( this.currentSequence.layers ), function(layer){
			if( layer.rendered ) layer.trigger('player_unrender')
		});
		
		if(this.zeega) zeega.app.restoreFromPreview();//zeega.app.previewMode = false;
		
		// remove the player div
		this.$el.fadeOut( 450, function(){ $(this).remove() });
	},
	
	resetPlayer : function()
	{
		var _this = this;
		
		
		this.unsetListeners();
		_.each( _.toArray( this.currentSequence.layers ), function(layer){
			if( layer.rendered ) layer.trigger('player_unrender')
		});
		
		if(this.zeega) zeega.app.restoreFromPreview();//zeega.app.previewMode = false;
		
		// remove the player div
		this.$el.fadeOut( 450, function(){ $(this).remove() });
	},
	
	
	
	
	/*****************************
	
	VIEW FUNCTIONS
	
	*****************************/
	
	render : function()
	{
		$(this.el).empty();
		//get the current viewport resolution
		var viewWidth = this.container.width;
		var viewHeight = this.container.height;
		
		var cssObj = {};
		if( viewWidth / viewHeight > this.viewportRatio )
		{
			cssObj.height = viewHeight +'px';
			cssObj.width = viewHeight * this.viewportRatio +'px'
		}else{
			cssObj.height = viewWidth / this.viewportRatio +'px';
			cssObj.width = viewWidth +'px'
		}
		
		//constrain proportions in player
		$(this.el).attr('id','preview-wrapper').append( this.getTemplate() );
		$(this.el).find('#preview-media').css( cssObj );
		this.container.empty();
		console.log('emptied frame');
		console.log(this.sequences);
		this.container.prepend( this.el );

		//hide the editor underneath to prevent scrolling
		//$('#wrapper').hide();
		
		$(this.el).fadeIn();
		this.initListeners();
	},
	
	/*****************************
	
	EVENT FUNCTIONS
	
	*****************************/
	
	updateArrows : function()
	{
		var leftFrame = this.getLeft();
		var rightFrame = this.getRight();
		
		if( this.currentSequence.frames.length == 1 )
		{
			this.$el.find('#preview-left').hide();
			this.$el.find('#preview-right').hide();
		}
		else if( !this.overlaysHidden )
		{
			if( !leftFrame ) this.$el.find('#preview-left').fadeOut();
			else if( this.$el.find('#preview-left').is(':hidden') ) this.$el.find('#preview-left').fadeIn();

	 		if( !rightFrame ) this.$el.find('#preview-right').fadeOut();
			else if( this.$el.find('#preview-right').is(':hidden') ) this.$el.find('#preview-right').fadeIn();
		}
		
	},

	fadeOutOverlays : function( _this )
	{
		_this.overlaysHidden = true;
		$('.player-overlay').fadeOut('slow');
		$('.preview-nav').fadeOut('slow');
	},
	
	initListeners : function()
	{
		var _this = this;
		$(window).bind( 'keydown', function(e){
		    switch(e.which)
			{
				case 27:
					if(_this.zeega) _this.closePlayer(); //don't close if standalone player
					break;
				case 8:
					if(_this.zeega) _this.closePlayer(); //don't close if standalone player
					break;
				case 37:
					_this.goLeft();
					break;
				case 39:
					_this.goRight();
					break;
				case 38:
					_this.goUp();
					break;
				case 40:
					_this.goDown();
					break;
				case 32:
					_this.playPause();
					break;
			}
		});
		
		//resize player on window resize
		window.onresize = function(event)
		{
			/*
			//resize ##zeega-player
			var viewWidth = window.innerWidth;
			var viewHeight = window.innerHeight;
			console.log(viewHeight);
			console.log(viewWidth);

			var cssObj = {};
			if( viewWidth / viewHeight > _this.viewportRatio )
			{
				cssObj.height = viewHeight +'px';
				cssObj.width = viewHeight * _this.viewportRatio +'px'
			}else{
				cssObj.height = viewWidth / _this.viewportRatio +'px';
				cssObj.width = viewWidth +'px'
			}

			//constrain proportions in player
			_this.$el.find('#preview-media').css( cssObj );
			*/
		}
		
		$('#zeega-player').keydown(function(event) {
			
		});
		
		
		$('#citation').mouseleave(function(){
			_.delay( closeCitationBar, 500 );
		})
		

		var fadeOutOverlays = _.debounce(this.fadeOutOverlays,5000);
		//hide all controls and citation
		onmousemove = function()
		{
			if( !_this.overlaysHidden )
			{
				fadeOutOverlays( _this );
			}else{
				_this.overlaysHidden = false;
				$('.player-overlay').fadeIn('slow');
				_this.updateArrows();
			}
		}
		

	},
	
	fullscreen: function(){
			var player=document.getElementById('tah-zeega-player');
			if (player.requestFullscreen) player.requestFullscreen();
			else if (player.mozRequestFullScreen) player.mozRequestFullScreen();
			else if (player.webkitRequestFullScreen) player.webkitRequestFullScreen();
			
			
	

			var viewWidth = window.innerWidth;
			var viewHeight = window.innerHeight;
			console.log(viewHeight);
			console.log(viewWidth);

			var cssObj = {};
			if( viewWidth / viewHeight > this.viewportRatio )
			{
				cssObj.height = viewHeight +'px';
				cssObj.width = viewHeight * this.viewportRatio +'px'
			}else{
				cssObj.height = viewWidth / this.viewportRatio +'px';
				cssObj.width = viewWidth +'px'
			}

			//constrain proportions in player
			this.$el.find('#preview-media').css( cssObj );
			this.container.css( cssObj );
			return false;
	},
	
	unsetListeners : function()
	{
		$(window).unbind( 'keydown' ); //remove keylistener
		onmousemove = null;
	},
	
	events : {
		'click #preview-left' : 'goLeft',
		'click #preview-right' : 'goRight',
		'click #preview-close' : 'closePlayer',
		//'mouseover #citation' : 'expandCitationBar',
		//'mouseout #citation'	: "closeCitationBar", 
		'click #fullscreen-button': "fullscreen",
	},
	
	expandCitationBar : function()
	{
		console.log('expand citation bar')
		this.$el.find('#citation').animate({ height : '100px' })
	},
	
	closeCitationBar : function()
	{
		console.log('close citation bar')
		
	},
	
	/*****************************
	
	INIT FUNCTIONS
	
	*****************************/
	
	parseData : function( data )
	{
		// make sequence collection
		this.sequences = new this.Sequences( data.project.sequences )
	},
	

	
	
	setCurrentSequence : function( id )
	{
		this.currentSequence = this.sequences.get(id);
	},
	
	setCurrentFrame : function( id )
	{
		this.currentFrame = this.currentSequence.frames.get(id)
	},
	
	setCurrentLayers : function()
	{
		// set collection of current layers
		var _this = this;
		var layers = [];
		_.each( this.currentFrame.get('layers'), function(layerID){
			layers.push( _this.currentSequence.layers.get(layerID) )
		});
		var CurrentLayers = Backbone.Collection.extend();
		this.currentLayers = new CurrentLayers(layers)
	},
	
	/*****************************
	
	BACKBONERS
	
	*****************************/
	
	
	generateBackbone : function()
	{
		var _this = this;
		
		var LayerModel = Backbone.Model.extend();
		var FrameModel = Backbone.Model.extend();
		
		var loaderView = Backbone.View.extend({
			
			className : 'load-wrapper',
			loadedCount : 0,
			
			initialize : function( options )
			{
				this.options = options;
			},
			
			render : function()
			{
				if(this.options.count>0) $(this.el).append( _.template(this.getTemplate(), this.options) )
				
				return this;
			},
			
			incrementLoaded : function()
			{
				var _this = this;
				this.loadedCount++;
				$(this.el).find('.loaded-count').html( this.loadedCount );
				$(this.el).find('.progress').css({ width : this.loadedCount/this.options.count * 100 +'%' })
				
				if(this.options.count == this.loadedCount)
				{
					$(this.el).fadeOut('slow', function(){ _this.remove() });
				}
			},
			
			getTemplate : function()
			{
				html =
				
					'<div class="loader">'+
						'<div class="progress"></div>'+
					'</div>'+
					'<div class="loader-text">loaded <span class="loaded-count">0</span> out of <span class="total-count"><%= count %></span> items</div>';
				
				return html;
			}
		})
		
		var LoadingCollection = Backbone.Collection.extend({
			
			loading : [],
			ready : [],
			
			initialize : function()
			{
				this.on('loading', this.updateLoadingStatus, this);
				this.on('ready', this.updateReadyStatus, this);
			},
			updateLoadingStatus : function( id )
			{
				var model = this.get(id);
				if( model.status != 'loading' && model.status != 'ready')
				{
					model.status = 'loading';
					this.loading.push(id)
				}
			},
			updateReadyStatus : function( id )
			{
				var model = this.get(id);
				if( model.status != 'ready' )
				{
					this.loading = _.without(this.loading,id);
					model.status = 'ready';
					this.ready.push(id);
				}
			}
		});
		
		var SequenceModel = Backbone.Model.extend({

			initialize : function()
			{
				this.parseData();
			},
			
			parseData : function()
			{
				var __this = this;
				//generate frames & layers collections
				this.frames = new LoadingCollection( this.get('frames') );
				
				// add a loader view to each frame
				_.each( _.toArray(this.frames), function(frame){
					frame.loader = new loaderView({count: frame.get('layers').length });
				})
				
				/***************
				
				added loader view to each frame model
				
				**************/
				
				var Layer = zeega.module('layer');
				var layerArray = [];
				_.each( this.get('layers'), function( layerData ){
					var layer = new Layer[layerData.type]( layerData, {player:true} );
					layer.id = parseInt(layer.id);
					layerArray.push( layer );
				});
				this.layers = new LoadingCollection( layerArray );
				
				this.layers.on( 'ready', this.updateFrameStatus, this );
				
				this.unset('frames');
				this.unset('layers')
			},
			
			updateFrameStatus : function( layerID )
			{
				var __this = this;
				
				
				_.each( _.toArray(this.frames), function(frame){
					var frameLayers = frame.get('layers');
					var readyLayers = __this.layers.ready;

					if(_.include( frameLayers, layerID) ) frame.loader.incrementLoaded();
					if( _.difference(frameLayers,readyLayers).length == 0 )
					{
						frame.trigger('ready', frame.id);
					}
				})
			}
			
		});
		
		
		this.Sequences = Backbone.Collection.extend({

			model : SequenceModel,

			initialize : function()
			{

			}

		});
	},
	
	
	/*****************************
	
	TEMPLATES
	
	*****************************/
	
	getTemplate : function()
	{
		html ="<div id='zeega-player'>";
			//"<div id='fullscreen-button' class='player-overlay'><a HREF='#'><img src='http://findicons.com/files//icons/2232/wireframe_mono/48/expand.png' height='10px'/></a></div>";
		
		
		if(this.zeega) html +=
			"<div id='preview-close' class='player-overlay'><a href='#'><span class='zicon orange zicon-close' ></span></a></div>";
		
		
		html +=
		
			"<div id='preview-left' class='hidden preview-nav-arrow preview-nav'>"+
				"<div class='arrow-background'></div>"+
					"<img  height='75' width='35' src='http://dev.zeega.org/james/web/images/mediaPlayerArrow_shadow.png' >"+
				"</div>"+
				"<div id='preview-right' class='hidden preview-nav-arrow preview-nav'>"+
					"<div class='arrow-background'></div>"+
					"<img height='75' width='35' src='http://dev.zeega.org/james/web/images/mediaPlayerArrow_shadow.png' >"+
				"</div>"+
				"<div id='preview-media'></div>"+
				"<div id='citation' class='player-overlay'><ul class='clearfix'></ul></div>"+
			"</div>"+
		"";
		
		return html;
	}
		
})
