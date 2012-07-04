module.exports = {
	watch:{
		filePattern:/.*\.js$/
	},
	convert:[
		{
		    input: 'js/loaders/index.js',
		    output: 'js_min/index.js',
		    message:"Don't forget to check the JS paths in index.php"
		},	
	]
}
