var express = require('express'),
uuid = require('node-uuid'); //https://github.com/broofa/node-uuid
var _ = require('underscore')._

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
app.get("/Contact/list", function(req, res){
	console.log("Get " + JSON.stringify(contacts));
	res.send(contacts);
});

app.post('/Contact/create', function(req, res){
  	var newContact = req.body;
	newContact.id = uuid.v1();
	console.log("Create " + JSON.stringify(newContact));
	contacts.push(newContact);
  	res.send(req.body);
});

app.put('/Contact/update', function(req, res){
	var editContact = _.find(contacts, function(c){
		return req.body.id == c.id;
	});
  	editContact.firstname = req.body.firstname;
	editContact.lastname = req.body.lastname;
	console.log("Update " + JSON.stringify(editContact));
  	res.send(req.body);
});

app.del('/Contact/delete/:id', function(req, res){
	var editContact = _.find(contacts, function(c){
		return req.params.id == c.id;
	});
	console.log("Delete " + JSON.stringify(editContact));
	contacts = _.without(contacts, editContact);
	res.send({ id : req.params.id});
});

app.listen(3000);
console.log("server running at http://localhost:3000");
