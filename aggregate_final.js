var Path = require('path'),
	aggregate = require('./script-aggregation/node/triggerAggregate'),
	config = require('./aggregate_conf.js'),
	loaders = require('./script-aggregation/loaders_manager.js')

loaders.create(config);

config.uglify = true;
aggregate.trigger(config);

loaders.destroy(config);