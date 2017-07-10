var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var util = require('util');

var addressSchema = mongoose.Schema({
	Id: Number,
	City: String
});

var Address = mongoose.model('Address', addressSchema);

const MAX_RESPONSE_SIZE = 5;

function validateAddress(address) {			// Example server validator
	return /^[a-zA-Z0-9а-яА-Я\s-.]*$/.test(address);
}

router.get('/addresses', function(req, res, next) {

	if(!validateAddress(req.query.cityPrefix)) {
		res.status(400).json({
			message: "Wrong cityPrefix value"
		});
		return;
	}

	let pattern = util.format('(\\s|^)%s', req.query.cityPrefix.replace(/\./g, '\\.') || '');
	let re = new RegExp(pattern,'i');

	Address
		.find({City: re})
		.count()
		.exec((err, count) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					message: "Couldn't get count"
				})
			}
			Address
				.find({City: re})
				.limit(MAX_RESPONSE_SIZE)
				.exec((err, addresses) => {
					if (err) {
						console.log(err);
						return res.status(500).json({
							message: "Couldn't get address"
						})
					}
					res.json({
						addresses,
						total: count
					});
				});
		});
});

module.exports = router;