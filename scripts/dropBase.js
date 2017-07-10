var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/db', function() {
	mongoose.connection.db.dropDatabase(function(err) {
		console.log('db dropped')
		mongoose.connection.db.close();
	});
})