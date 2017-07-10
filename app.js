var express = require('express');
var app = express();
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/db');
var addresses = require('./routes/addresses');

const STATIC_PATH = 'public';

app.use('/', express.static(STATIC_PATH));
app.use('/api', addresses);

app.listen(8080, function() {
	console.log('App listening on port 8080');
});