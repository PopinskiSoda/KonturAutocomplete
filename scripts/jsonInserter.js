var mongoose = require('mongoose');
var json = require('../' + process.argv[2]);
var db = mongoose.connect('mongodb://localhost/db');

var addressSchema = mongoose.Schema({
	Id: Number,
	City: String
});

var Address = mongoose.model('Address', addressSchema);

Address.collection.insertMany(json, function(err, res) {
	if (err) {
		console.log("Couldn't insert JSON");
	} else {
		console.log('JSON file succesfully inserted');
	}
	db.disconnect();
});