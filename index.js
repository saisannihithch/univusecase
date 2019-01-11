/*
 * University Usecase - Node Server */
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var bodyParser = require('body-parser');
var cfenv = require('cfenv');

var appEnv = cfenv.getAppEnv();
var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('appName', 'org.gryphon.casestudy');
app.set('port', appEnv.port);

app.set('views', path.join(__dirname + '/html'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/html'));
app.use(bodyParser.json());

// Define your own router file in controller folder, export the router, add it into the index.js.
// app.use('/', require("./controller/yourOwnRouter"));
app.use('/', require("./client_app/controller/router"));

if (cfenv.getAppEnv().isLocal == true)
  { 
    var server = app.listen(app.get('port'), function() { 
    console.log('Listening locally on port %d', server.address().port);}); }
  else { 
    var server = app.listen(app.get('port'), function() { 
      console.log('Listening remotely on port %d', server.address().port);}); 
  }
