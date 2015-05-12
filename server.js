var express = require('express'),
	browserify = require('browserify-middleware'),
	reactify = require('reactify'),
	less = require('less-middleware'),
	nunjucks = require('nunjucks'),
	config = require('./client/config'),
	routes = require('./server/routes'),
	path = require('path');

// initialise express
var app = express();

// use nunjucks to process view templates in express
app.set('views', path.join(__dirname, 'server/templates/views'))
app.set('view engine', 'html')
nunjucks.configure('server/templates/views', {
	autoescape: false,
    express: app
});

// less will automatically compile matching requests for .css files
app.use(less('public'));
// public assets are served before any dynamic requests
app.use(express.static('public'));

// common packages are precompiled on server start and cached
app.get('/js/' + config.common.bundle, browserify(config.common.packages, {
	cache: true,
	precompile: true
}));

// any file in /client/scripts will automatically be browserified,
// excluding common packages.
app.use('/js', browserify('./client/scripts', {
	external: config.common.packages,
	transform: ['reactify']
}));

/*
	set up any additional server routes (api endpoints, static pages, etc.)
	here before the catch-all route for index.html below.
*/
app.use('/', routes)

// app.get('*', function(req, res) {
// 	// this route will respond to all requests with the contents of your index
// 	// template. Doing this allows react-router to render the view in the app.
//     res.render('index.html');
// });

// start the server
var server = app.listen(process.env.PORT || 3000, function() {
	console.log('\nServer ready on port %d\n', server.address().port);
});
