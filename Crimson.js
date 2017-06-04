var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var fs = require("fs");
var mongoose = require('mongoose');

var multiparty = require('multiparty');

var url = require("url");

var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var dataroot = __dirname + '/data/';

/* On déclare les ressources statiques */
app.use(express.static(__dirname + '/data'));
app.use(express.static(__dirname + '/Kiwideo'));
app.use(express.static(__dirname + '/bootstrap'));

app.use(session({secret: 'Crimson'}));
app.use(bodyParser.urlencoded({ extended: false }))
.use(bodyParser.json());

app.get('/', function(req, res) {

	req.session.mooc = '';
	req.session.type = '';
	req.session.save();

    filesList = [];
    fs.readdir(dataroot, function(err, files) {
	    res.render(__dirname + '/bootstrap/index.ejs');
    });

})

app.get('/home', function(req, res) {

	req.session.type = 'Images';
	req.session.save();

	filesList = [];
	fs.readdir((dataroot + req.session.mooc + req.session.type), function(err, files){
		if (err) {
			return console.error(err);
		}
		files.forEach (function (file){
			filesList.push(file.toString());
		});
		var currentFolder = req.session.type.split('/');

		res.render(__dirname + '/bootstrap/index.ejs', {filesList: filesList, currentFolder: currentFolder, error: "Le projet sélectionné ne contient pas de fichier ressource!"});
	});
})

.get('/musiques', function(req, res) {

	fs.readdir((dataroot + '/musiques'), function(err, files){
		if (err) {
			return console.error(err);
		}
		var filesList = files.map(function (file){
			return {
				name: file.toString(),
			};
		});

		res.render(__dirname + '/bootstrap/pages/index.ejs', {filesList: filesList, error: "Le projet sélectionné ne contient pas de fichier ressource!"});
	});

})

.post('/upload', function(req, res) {

	var form = new multiparty.Form();

	form.parse(req, function(err, fields, files) {
		if (err) {
			res.writeHead(400, {'content-type': 'multipart/form-data'});
			res.end("invalid request: " + err.message);
			return;
		}

		files.files2upload.forEach(function(file) {
			console.log(file);
			var name = file.originalFilename.split('/');
			name = name[name.length - 1];
			console.log(dataroot + req.session.type + '/' + file.originalFilename);
			fs.createReadStream(file.path).pipe(fs.createWriteStream(dataroot +  req.session.type + '/' +  name));
		});

		res.writeHead(200, {'content-type': 'multipart/form-data'});

	});

})

.post('/rename/:id', function(req, res) {
	fs.rename(dataroot + req.session.type + '/' + req.params.id, dataroot + req.session.type + '/' + req.body.newname, function(err) {
	res.redirect('/home/' + req.session.type);
	});
})

.post('/delete', function(req, res) {

	var form = new multiparty.Form();

	form.parse(req, function(err, fields, files) {
		if (err) {
			res.writeHead(400, {'content-type': 'multipart/form-data'});
			res.end("invalid request: " + err.message);
			return;
		}

		fields.files2delete.forEach(function(file) {
			fs.unlinkSync(dataroot + req.session.type + '/' + file);
		});
	});
})

.get('/delete/:id', function(req, res) {
	var isFile = fs.statSync(dataroot + req.session.type + '/' + req.params.id).isFile();

	if (isFile) {
		fs.unlink(dataroot + req.session.type + '/' + req.params.id, function(err) {
			res.redirect('/home/' + req.session.type);
		});
	} else {
		fs.rmdir(dataroot + req.session.type + '/' + req.params.id, function(err) {
			res.redirect('/home/' + req.session.type);
		});
	}
})

.get('/createFolder', function(req, res) {
	fs.mkdir(dataroot + req.session.type + '/Nouveau Dossier', function(err) {
		res.redirect('/home/' + req.session.type);
	});
})

.post('/save', function(req, res) {
	var path = req.body.locate.split('/home/');

	console.log(req.body);

	req.session.file = req.body.file;
	req.session.cut = req.body.cut === 'true';
	req.session.locate = path[1];
	req.session.save();

	res.send('save');

})

.get('/copy', function(req, res) {

	if (req.session.file != '') {
		var newname = req.session.file + ((req.session.locate == req.session.type) ? '(copy)' : '');
		fs.createReadStream(dataroot + '/' + req.session.locate  + '/' + req.session.file).pipe(fs.createWriteStream(dataroot + req.session.type + '/' +  newname));

		if (req.session.cut == true) {
			console.log(dataroot + req.session.locate + '/' + req.session.file);
			fs.unlinkSync(dataroot + req.session.locate + '/' + req.session.file);
		}

		req.session.file = '';
		req.session.locate = '';
		req.session.cut = '';
		req.session.save();

	}
	res.send('copy');
})

server.listen(8080);
