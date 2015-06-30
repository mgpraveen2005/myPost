/*
Author: Praveen
Created: 2015-06-29
*/

var config = require('./config'),
	express = require('express'),
	app = express(),
	request = require('request');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded());

app.get('/', function (req, res) {
  res.redirect('/index.html');
});

app.get('/api/list', function (req, res) {
	// List all posts
	var query="MATCH (n:Post) RETURN n LIMIT {limit}";
	var params={limit: 20};
	var cb=function(err,data) { 
		res.send(JSON.stringify(data)); 
	}
	runCypher(query,params,cb);
});

app.get('/api/detail/:title', function (req, res) {
	// Fetch the Details of a Post
	var params = { title: req.params.title};
	var query="MATCH (n:Post) WHERE n.title = {title} SET n.visit = n.visit+1 RETURN n";
	var cb=function(err,data) { 
		res.send(JSON.stringify(data)); 
	}
	runCypher(query,params,cb);
});

app.post('/api/add', function (req, res) {
	// Add new Post
	var params = req.body;
	params['timestamp'] = new Date().getTime();
	var query="CREATE (n:Post { title: {title}, description: {description}, author: {author}, timestamp: {timestamp}, visit: 0 })";
	var cb=function(err,data) {
		res.send(JSON.stringify(data));
	};
	runCypher(query,params,cb);
});

app.get('/api/mostVisits', function (req, res) {
	// List all posts by Visits
	var query="MATCH (n:Post) RETURN n ORDER BY n.visit DESC LIMIT {limit}";
	var params={limit: 20};
	var cb=function(err,data) { 
		res.send(JSON.stringify(data)); 
	}
	runCypher(query,params,cb);
});

app.get('/api/listByAuthor/:author', function (req, res) {
	// List all posts by an Author
	var params = { author: req.params.author};
	var query="MATCH (n:Post) WHERE n.author = {author} RETURN n LIMIT 20";
	var cb=function(err,data) { 
		res.send(JSON.stringify(data)); 
	}
	runCypher(query,params,cb);
});

app.get('/api/authorList', function (req, res) {
	// List all Authors
	var query="MATCH (n:Post) RETURN DISTINCT n.author LIMIT {limit}";
	var params={limit: 20}
	var cb=function(err,data) { 
		res.send(JSON.stringify(data)); 
	}
	runCypher(query,params,cb);
});

app.listen(config.server.port);
console.log("Server running at http://"+config.server.host+":"+config.server.port);

var runCypher = function (query,params,cb) {
	var authKey = 'Basic ' + new Buffer(config.db.username + ':' + config.db.password).toString('base64');
	var options = {
		url:config.db.transactionUrl,
		headers: {
			'Authorization': authKey, 
		}, 
        json:{statements:[{statement:query,parameters:params}]}
	}
	request.post(options, function(err,res) { cb(err,res.body)})
}