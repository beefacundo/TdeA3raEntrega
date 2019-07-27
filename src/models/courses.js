const mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const cursoSchema = new Schema({
	adminId: {
		type: Number,
		required: true,
		min:1
	},
	index: {
		type: Number,
		required: true,
		min:1
	},
	name : {
		type : String,
		required : true	,
		trim : true

	},
	durationHs: {
		type: Number,
		default: 32	,
		min: 32,
	},
	description: {
		type: String
	},
	teacher : {
		type: String,
	},
	cost:{
		type: Number,
		min: 0
	},
	places: {
		type: Number,
		min: 25,
		max: 40
	},
	free: {
		type: Number,
		min: 0,
		default: 40//this.get('places')
	},
	status: {
		type: Boolean,
		default: true
	},
	remote: {
		type: Boolean,
		default: true
	},
	schedule: {
		type: Buffer
	}
});

//bookSchema.plugin(autoIncrement.plugin, { model: 'Book', field: 'index' });

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso