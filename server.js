var express = require('express'),
uuid = require('node-uuid'); //https://github.com/broofa/node-uuid
var _ = require('underscore')._
var fs = require('fs');

app = module.exports = express.createServer();
//app = express.createServer();

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('views', __dirname + '/views');
    app.set('view engine', 'jshtml');
    app.use(express.static(__dirname + '/public'));
});

var contacts =  [];
var contact = {
	id : uuid.v1(),
	firstname: "Steve",
	lastname : "Gentile"
}

contacts.push(contact);

app.get("/", function(req, res){
	res.render("index");
});
app.get("/Contact", function(req, res){
	console.log("Get " + JSON.stringify(contacts));
	res.send(contacts);
});

app.post('/Contact', function(req, res){
	var newContact = req.body;
	newContact.id = uuid.v1();
	console.log("Create " + JSON.stringify(newContact));
	contacts.push(newContact);
	res.send(req.body);
});

var url = require('url');

app.get("/template/:area/:name", function(req, res) {
	var area = req.params.area;
	var name = req.params.name;

	var path = "public/Scripts/" + area + "/" + name + ".tmpl.htm";

	console.log(path);
	fs.readFile(path, function(error, content) {
		if(error) {
			res.writeHead(404);
			res.end();
		} else {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(content, 'utf-8');
		}
	});
	
});

app.put('/Contact/:id', function(req, res){
	var editContact = _.find(contacts, function(c){
		return req.body.id == c.id;
	});
  	editContact.firstname = req.body.firstname;
	editContact.lastname = req.body.lastname;
	console.log("Update " + JSON.stringify(editContact));
  	res.send(req.body);
});

app.del('/Contact/:id', function(req, res){
	var editContact = _.find(contacts, function(c){
		return req.params.id == c.id;
	});
	console.log("Delete " + JSON.stringify(editContact));
	contacts = _.without(contacts, editContact);
	res.send({ id : req.params.id});
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
