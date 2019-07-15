const mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const inscriptionSchema = new Schema({
	index: {
		type: Number,
		required: true,
		min:1
	},
	courseID : {
		type : Number
	},
	userID: {
		type: Number
	},
	registered: {
		type: String
	}
});

//bookSchema.plugin(autoIncrement.plugin, { model: 'Book', field: 'index' });

const Inscription = mongoose.model('Inscription', inscriptionSchema);

module.exports = Inscription